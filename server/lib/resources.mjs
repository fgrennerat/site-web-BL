// Lecture/écriture des ressources sur disque (volume Docker en prod,
// ./data/resources en dev) et fusion avec le fichier de config par matière.
//
// Organisation sur disque :
//   <root>/<slug>/.config.json   description, sections[], videos[], files{}
//   <root>/<slug>/<fichier>      tous les fichiers d'une matière, à plat
//
// Les "sections" ne sont PAS des dossiers : ce sont des entrées de
// .config.json ({id, label, order}), et un fichier ou une vidéo y est
// rattaché par son id via files[path].section / videos[i].section. Ça
// permet de réorganiser/renommer sans jamais toucher au disque.
//
// ".config.json" est un fichier caché : il est donc automatiquement exclu
// du scan (comme .DS_Store, .gitkeep...).

import {
  readdirSync,
  existsSync,
  statSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
} from "node:fs";
import { join, extname } from "node:path";

const CONFIG_FILENAME = ".config.json";

export const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".odt",
  ".ods",
  ".odp",
  ".png",
  ".jpg",
  ".jpeg",
]);

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 Mo

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function prettify(name) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

// Un segment de chemin ne doit jamais permettre de sortir du dossier de la
// matière : pas de "/", "\", octet nul, ni "." / "..".
export function sanitizeSegment(name) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed || trimmed === "." || trimmed === "..") {
    throw new HttpError(400, `Nom invalide : "${name}"`);
  }
  if (trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("\0")) {
    throw new HttpError(400, `Nom invalide : "${name}"`);
  }
  return trimmed;
}

function readConfig(slugDir) {
  const configPath = join(slugDir, CONFIG_FILENAME);
  if (!existsSync(configPath)) return {};
  try {
    return JSON.parse(readFileSync(configPath, "utf-8"));
  } catch {
    return {};
  }
}

function writeConfig(slugDir, config) {
  mkdirSync(slugDir, { recursive: true });
  writeFileSync(join(slugDir, CONFIG_FILENAME), `${JSON.stringify(config, null, 2)}\n`);
}

// Fichiers à plat uniquement (pas de récursion) : le stockage n'a plus de
// notion de sous-dossier, tout vit directement dans <root>/<slug>/.
function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .map((entry) => ({ path: entry.name, name: entry.name }));
}

function sortByOrder(items, sectionMeta) {
  items.sort((a, b) => {
    const orderA = a.section ? sectionMeta.get(a.section)?.order ?? Infinity : -Infinity;
    const orderB = b.section ? sectionMeta.get(b.section)?.order ?? Infinity : -Infinity;
    if (orderA !== orderB) return orderA - orderB;
    const ga = a.group || "";
    const gb = b.group || "";
    if (ga !== gb) return ga.localeCompare(gb, "fr");
    return (a.title || "").localeCompare(b.title || "", "fr");
  });
  return items;
}

// Vue publique, fusionnée : scan disque + surcharges du .config.json.
export function getResourceData(rootDir, slug) {
  const safeSlug = sanitizeSegment(slug);
  const slugDir = join(rootDir, safeSlug);
  const config = readConfig(slugDir);
  const sections = config.sections || [];
  const sectionMeta = new Map(sections.map((s) => [s.id, s]));
  const fileOverrides = config.files || {};

  const files = collectFiles(slugDir).map((f) => {
    const override = fileOverrides[f.path] || {};
    return {
      section: override.section || null,
      group: override.section ? sectionMeta.get(override.section)?.label || null : null,
      title: override.title || prettify(f.name),
      url: `/resources/${safeSlug}/${f.path}`,
      path: f.path,
    };
  });
  sortByOrder(files, sectionMeta);

  const videos = (config.videos || []).map((v) => ({
    ...v,
    section: v.section || null,
    group: v.section ? sectionMeta.get(v.section)?.label || null : null,
  }));
  sortByOrder(videos, sectionMeta);

  return {
    slug: safeSlug,
    description: config.description || null,
    teacher: config.teacher || null,
    sections,
    videos,
    files,
  };
}

// description/teacher/videos/sections sont remplacés tels quels (le client
// renvoie toujours la valeur complète, qu'il a déjà via GET
// /api/resources/:slug). files est fusionné clé par clé pour permettre de
// ne renvoyer que la surcharge d'un seul fichier sans écraser les autres.
export function updateConfig(rootDir, slug, patch) {
  const safeSlug = sanitizeSegment(slug);
  const slugDir = join(rootDir, safeSlug);
  const current = readConfig(slugDir);
  const next = { ...current };
  if (patch.description !== undefined) next.description = patch.description;
  if (patch.teacher !== undefined) next.teacher = patch.teacher;
  if (patch.videos !== undefined) next.videos = patch.videos;
  if (patch.sections !== undefined) next.sections = patch.sections;
  if (patch.files !== undefined) {
    next.files = { ...(current.files || {}), ...patch.files };
  }
  writeConfig(slugDir, next);
  return next;
}

// Toujours à plat : pas de dossier de destination, "section" est une pure
// métadonnée de config, appliquée ici en plus de l'écriture du fichier pour
// ne pas exiger un second aller-retour depuis /admin.
export function saveUpload(rootDir, slug, filename, buffer, { overwrite = false, section } = {}) {
  const safeSlug = sanitizeSegment(slug);
  const safeFilename = sanitizeSegment(filename);
  const ext = extname(safeFilename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new HttpError(400, `Type de fichier non autorisé (${ext || "sans extension"})`);
  }

  const slugDir = join(rootDir, safeSlug);
  mkdirSync(slugDir, { recursive: true });
  const target = join(slugDir, safeFilename);
  if (existsSync(target) && !overwrite) {
    throw new HttpError(409, "Un fichier du même nom existe déjà");
  }
  writeFileSync(target, buffer);

  if (section) {
    updateConfig(rootDir, safeSlug, { files: { [safeFilename]: { section } } });
  }

  return safeFilename;
}

export function deleteFile(rootDir, slug, filename) {
  const safeSlug = sanitizeSegment(slug);
  const safeFilename = sanitizeSegment(filename);
  const target = join(rootDir, safeSlug, safeFilename);
  if (!existsSync(target) || !statSync(target).isFile()) {
    throw new HttpError(404, "Fichier introuvable");
  }
  unlinkSync(target);
}

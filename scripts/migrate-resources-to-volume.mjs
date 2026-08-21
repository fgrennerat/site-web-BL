// Migration ponctuelle : copie public/documents/ (encore versionné dans
// git à ce stade) vers data/resources/ (le layout attendu par server/ —
// fichiers à plat, sections purement virtuelles dans .config.json), et
// écrit un .config.json de départ par matière à partir des descriptions et
// vidéos qui étaient jusqu'ici codées en dur dans src/data/disciplines.js
// et src/data/generalResources.js. Tout sous-dossier de
// public/documents/<slug>/ devient une section (le chemin du sous-dossier
// sert de nom de section, ex. "Annales / 2024").
//
// À lancer une seule fois :
//   node scripts/migrate-resources-to-volume.mjs
//
// Pour peupler un volume de production (qui ne contient pas public/documents,
// puisqu'il n'est plus versionné), copiez ensuite le contenu de
// data/resources/ généré ici dans le volume avant le premier démarrage,
// par exemple :
//   docker run --rm -v resources:/dest -v "$PWD/data/resources":/src:ro \
//     alpine cp -a /src/. /dest/

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { disciplines } from "../src/data/disciplines.js";

const SRC = join(process.cwd(), "public", "documents");
const DEST = join(process.cwd(), "data", "resources");

// Vidéos qui étaient déclarées à la main dans disciplines.js /
// generalResources.js avant que les vidéos ne deviennent éditables depuis
// /admin. À adapter si le contenu a changé entre-temps.
const SEED_VIDEOS = {
  maths: [
    {
      title: "Introduction à l'algèbre linéaire",
      url: "https://www.3blue1brown.com/?search=linear+algebra&lesson=eola-preview",
    },
  ],
};

const GENERAL_FILES = ["EDT.pdf", "travailRentreeHK.pdf"];

function slugifyId(label) {
  return (
    label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

// Copie tous les fichiers de `from` (récursivement) à plat dans `to`, en
// transformant chaque sous-dossier traversé en section virtuelle.
function flattenCopy(from, to) {
  const sections = new Map(); // id -> {id, label, order}
  const files = {};
  let order = 0;

  function walk(dir, relLabel) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full, relLabel ? `${relLabel} / ${entry.name}` : entry.name);
      } else if (entry.isFile()) {
        let targetName = entry.name;
        if (existsSync(join(to, targetName))) {
          targetName = `${relLabel.replace(/[\\/ ]+/g, "-")}-${entry.name}`;
        }
        cpSync(full, join(to, targetName));
        if (relLabel) {
          const id = slugifyId(relLabel);
          if (!sections.has(id)) {
            order += 1;
            sections.set(id, { id, label: relLabel, order });
          }
          files[targetName] = { section: id };
        }
      }
    }
  }

  mkdirSync(to, { recursive: true });
  walk(from, "");
  return { sections: [...sections.values()], files };
}

function writeConfig(slug, config) {
  const dir = join(DEST, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, ".config.json"), `${JSON.stringify(config, null, 2)}\n`);
}

if (!existsSync(SRC)) {
  console.log("[migrate] public/documents introuvable, rien à migrer.");
  process.exit(0);
}

mkdirSync(DEST, { recursive: true });

for (const d of disciplines) {
  const from = join(SRC, d.slug);
  if (!existsSync(from)) continue;
  const { sections, files } = flattenCopy(from, join(DEST, d.slug));
  writeConfig(d.slug, {
    description: d.description?.trim() || undefined,
    videos: SEED_VIDEOS[d.slug] || [],
    sections,
    files,
  });
  console.log(`[migrate] ${d.slug}: ${Object.keys(files).length} fichier(s) en section(s), ${sections.length} section(s)`);
}

// Ressources générales : fichiers à la racine de public/documents/.
mkdirSync(join(DEST, "general"), { recursive: true });
for (const file of GENERAL_FILES) {
  const from = join(SRC, file);
  if (existsSync(from)) {
    cpSync(from, join(DEST, "general", file));
  }
}
writeConfig("general", { videos: [] });

console.log(`[migrate] Terminé. Ressources copiées dans ${DEST}`);

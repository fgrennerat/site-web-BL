// Script généré pour scanner automatiquement public/documents/<matiere>/
// (et ses sous-dossiers) et produire la liste des fichiers disponibles pour
// chaque discipline. Lancé automatiquement avant "npm run dev" et
// "npm run build" (voir package.json). Rien à exécuter manuellement :
// déposez un fichier (dans un sous-dossier si besoin), puis
// "git add . && git commit && git push" suffit.
//
// Organisation possible :
//   public/documents/maths/programme.pdf         → sans catégorie
//   public/documents/maths/annales/2024.pdf       → catégorie "Annales"
//   public/documents/maths/annales/ens/2023.pdf   → catégorie "Annales / Ens"

import { readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, dirname } from "node:path";

const publicDocsDir = join(process.cwd(), "public", "documents");
const outFile = join(process.cwd(), "src", "data", "documentsManifest.js");

function prettify(name) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function collectFiles(dir, baseDir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      const relDir = relative(baseDir, dirname(fullPath));
      const group = relDir
        ? relDir.split(/[\\/]/).map(prettify).join(" / ")
        : null;
      results.push({
        group,
        title: prettify(entry.name),
        url: `/documents/${relative(join(baseDir, ".."), fullPath).split(
          "\\"
        ).join("/")}`,
      });
    }
  }
  return results;
}

const manifest = {};

if (existsSync(publicDocsDir)) {
  for (const entry of readdirSync(publicDocsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const folderPath = join(publicDocsDir, slug);
    const files = collectFiles(folderPath, folderPath).sort((a, b) => {
      const ga = a.group || "";
      const gb = b.group || "";
      if (ga !== gb) return ga.localeCompare(gb, "fr");
      return a.title.localeCompare(b.title, "fr");
    });
    manifest[slug] = files;
  }
}

mkdirSync(join(process.cwd(), "src", "data"), { recursive: true });
writeFileSync(
  outFile,
  `// Fichier généré automatiquement par scripts/generate-documents-manifest.mjs\n` +
    `// Ne pas modifier à la main — il est régénéré à chaque "npm run dev" / "npm run build".\n` +
    `export const documentsManifest = ${JSON.stringify(manifest, null, 2)};\n`
);

const count = Object.values(manifest).reduce((n, arr) => n + arr.length, 0);
console.log(
  `[documents] ${count} fichier(s) détecté(s) dans ${Object.keys(manifest).length} dossier(s).`
);

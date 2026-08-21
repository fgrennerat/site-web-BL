// API des ressources : lecture publique, écriture protégée par ADMIN_TOKEN.
// Sert aussi les fichiers eux-mêmes sous /resources/ (en prod, nginx proxifie
// /api/ et /resources/ vers ce process ; en dev, c'est le proxy Vite qui le
// fait — voir vite.config.js).

import express from "express";
import multer from "multer";
import path from "node:path";
import {
  HttpError,
  MAX_FILE_SIZE,
  deleteFile,
  getResourceData,
  saveUpload,
  updateConfig,
} from "./lib/resources.mjs";

// API_PORT (pas PORT) : en dev, PORT est déjà pris par le process Vite —
// voir vite.config.js / .claude/launch.json.
const PORT = process.env.API_PORT || 3001;
const RESOURCES_DIR = process.env.RESOURCES_DIR || path.join(process.cwd(), "data", "resources");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

if (!ADMIN_TOKEN) {
  console.warn(
    "[server] ADMIN_TOKEN n'est pas défini : les routes d'administration refuseront toutes les requêtes."
  );
}

const app = express();
app.disable("x-powered-by");
app.use(express.json());

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  next();
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_SIZE } });

app.get("/api/admin/check", requireAuth, (req, res) => {
  res.json({ ok: true });
});

app.get("/api/resources/:slug", (req, res, next) => {
  try {
    res.json(getResourceData(RESOURCES_DIR, req.params.slug));
  } catch (err) {
    next(err);
  }
});

app.put("/api/resources/:slug/config", requireAuth, (req, res, next) => {
  try {
    const { description, teacher, videos, sections, files } = req.body || {};
    const patch = {};
    if (description !== undefined) patch.description = description;
    if (teacher !== undefined) patch.teacher = teacher;
    if (videos !== undefined) patch.videos = videos;
    if (sections !== undefined) patch.sections = sections;
    if (files !== undefined) patch.files = files;
    res.json(updateConfig(RESOURCES_DIR, req.params.slug, patch));
  } catch (err) {
    next(err);
  }
});

// Un fichier par requête, toujours stocké à plat. L'upload par lot depuis
// /admin envoie une requête par fichier sélectionné (voir AdminPage.jsx).
// "section" est optionnel : rattache directement le fichier à une section
// existante (voir PUT .../config pour en créer) sans second aller-retour.
app.post("/api/resources/:slug/files", requireAuth, upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, "Aucun fichier reçu");
    const overwrite = req.query.overwrite === "true";
    const relPath = saveUpload(RESOURCES_DIR, req.params.slug, req.file.originalname, req.file.buffer, {
      overwrite,
      section: req.body?.section || undefined,
    });
    res.status(201).json({ path: relPath });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/resources/:slug/files/:filename", requireAuth, (req, res, next) => {
  try {
    deleteFile(RESOURCES_DIR, req.params.slug, req.params.filename);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.use("/resources", express.static(RESOURCES_DIR, { dotfiles: "deny" }));

app.use((err, req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Fichier trop volumineux (50 Mo max)" });
  }
  console.error(err);
  res.status(500).json({ error: "Erreur serveur" });
});

app.listen(PORT, () => {
  console.log(`[server] API à l'écoute sur :${PORT} (ressources dans ${RESOURCES_DIR})`);
});
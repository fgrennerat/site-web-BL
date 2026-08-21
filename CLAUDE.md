# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Communication site for the Prépa B/L (classe préparatoire littéraire) at Lycée Mounier. Presents the program on a homepage and a dedicated page per subject (`/<slug>`), each hosting that subject's resources (videos, documents). All content is in French. Stack: Vite + React (JS, no TypeScript) + Tailwind CSS v4 for the frontend, a small Express API for resource management.

## Commands

```bash
ADMIN_TOKEN=dev-secret npm run dev   # runs Vite (http://localhost:5173) and the API (port 3001) together via concurrently
npm run build                        # builds the frontend to dist/ (API is not bundled by this — see Deployment)
npm run lint                         # oxlint
npm run preview                      # preview a production build of the frontend only (no API — resource pages will fail to fetch)
```

There is no test suite configured. `ADMIN_TOKEN` gates every write endpoint (`/api/admin/check`, uploads, deletes, config updates) — without it the API refuses all of them. Resources live under `data/resources/` locally (gitignored, created by the API on demand); it mirrors what the Docker volume holds in production.

## Architecture

**Static site + a small stateful API, no database.** Site-wide/structural content (page copy, discipline identity) lives in React components and plain JS data modules, same as before. But per-subject *resources* — description text, video links, and uploaded documents — are no longer code. They live on disk under `data/resources/<slug>/` (a Docker volume in production) and are read/written at runtime through `server/`.

**Resource storage layout**: `data/resources/<slug>/` holds every file for that subject **flat** — no subfolders, ever. Sections are a purely virtual, config-only concept: a hidden `.config.json` (excluded from listings like dotfiles) holds `{ description, teacher, sections: [{id,label,order}], videos: [{title,url,section?}], files: {"name.pdf": {title?, section?}} }`. A file/video's `section` is just an `id` referencing an entry in `sections[]`; renaming or reordering a section is a pure config edit and never touches disk. A dangling `section` reference (e.g. after deleting that section) degrades gracefully to "no section" rather than erroring. `general` is a synthetic slug for the homepage's non-subject-specific resources (emploi du temps, etc.) — managed exactly the same way as a discipline.

**`server/lib/resources.mjs`** does the scan + merge: flat directory listing (skips dotfiles) merged with `.config.json` overrides/section lookups, sorted by section `order` then name. `server/index.mjs` is the Express app: `GET /api/resources/:slug` is public (returns `sections` too, not just merged `files`/`videos`, since a section can exist with nothing in it yet); `POST .../files` (single file per request — the admin UI's batch upload just loops client-side), `DELETE .../files/:filename`, and `PUT .../config` require `Authorization: Bearer <ADMIN_TOKEN>`. `PUT .../config` replaces `description`/`teacher`/`videos`/`sections` wholesale (the client always has the full current value from the last GET) but deep-merges `files` by key, so an admin can patch one file's title/section without resending every other override. It also serves the files themselves under `/resources/<slug>/...` (`express.static`, dotfiles denied).

**Discipline identity has two keys**, defined in `src/data/disciplines.js`: `code` (e.g. `"MAT (5h30)"`, short badge) and `slug` (e.g. `"maths"`, used for the route `/maths`, the resources folder name, and the API path). `disciplines.js` also carries a fallback `description`, used only until an admin saves one via `/admin` (the runtime config then takes over — see `SubjectPage.jsx`'s `data?.description || discipline.description`). Videos, sections, and the teacher name are **not** declared here anymore — they're runtime-only, edited through `/admin`.

**`AdminPage.jsx`** autosaves: text fields (description, teacher, section labels, file titles, video title/url) persist `onBlur`; `<select>` section-assignment dropdowns and drag-and-drop section reordering persist immediately `onChange`/`onDrop`. There are deliberately no "Enregistrer" buttons left for those — only for genuinely separate actions (create section, upload, delete). Because of React state-update batching, anything that saves on an *immediate* event (not blur) computes the next value explicitly and sends that, rather than reading component state that may not have re-rendered yet — see the comments above `commitVideoField`/`saveFile`'s `overrides` param in that file before changing this pattern.

**Routing**: `react-router-dom`, wired in `main.jsx`/`App.jsx`. `/` is the homepage (`pages/Home.jsx`), `/<slug>` is `pages/SubjectPage.jsx` (validates the slug against `disciplines.js`, 404s via `pages/NotFound.jsx` otherwise), `/admin` is `pages/AdminPage.jsx` (token-gated, not linked from nav). `Nav.jsx`'s section links are plain `<a href="/#section">` (not React Router `Link`) so they work as real anchor navigation from any route.

**Dev vs prod plumbing differs only in who proxies `/api` and `/resources`**: Vite's dev server proxies both to `http://localhost:3001` (`vite.config.js`); in the Docker image, nginx proxies both to the Node process running in the same container. The frontend always calls relative paths (`/api/...`, resource `url`s returned by the API) — no CORS, no env-specific base URL.

## Deployment

**Docker/GHCR only** — Netlify was dropped when this became a stateful app (no persistent disk, no long-running process for the volume + API). `.github/workflows/docker-build-push.yml` builds and pushes a single image to `ghcr.io/<repo>` on every push to `main`.

The `Dockerfile` is two-stage: Node builds the Vite frontend, then the final `nginx:alpine` stage additionally installs Node and the API's production dependencies, copies `server/`, and runs both nginx and the API under `entrypoint.sh` (supervised via `tini` as PID 1 — `/bin/sh` in Alpine is busybox `ash`, which has no `wait -n`, hence the polling loop in that script rather than something fancier). `nginx.conf` proxies `/api/` and `/resources/` to the Node process on `127.0.0.1:3001` and does SPA fallback (`try_files ... /index.html`) for everything else. The resources volume mounts at `/data/resources` (`RESOURCES_DIR` env var); `ADMIN_TOKEN` must be supplied as an env var at run time — never commit it. See `docker-compose.yml` for a runnable example and `README.md`'s Déploiement section for seeding a fresh volume from the one-time `scripts/migrate-resources-to-volume.mjs` migration.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page communication site for the Prépa B/L (classe préparatoire littéraire) at Lycée Mounier. Presents the program and hosts per-subject resources (videos, documents). All content is in French. Stack: Vite + React (JS, no TypeScript) + Tailwind CSS v4.

## Commands

```bash
npm run dev      # regenerates the documents manifest, then starts Vite dev server (http://localhost:5173)
npm run build    # regenerates the documents manifest, then builds to dist/
npm run lint     # oxlint
npm run preview  # preview a production build
```

There is no test suite configured. `npm run dev` / `npm run build` always regenerate `src/data/documentsManifest.js` first via their `pre*` hooks — never edit that file by hand. It's gitignored (not tracked), since both deploy paths below regenerate it themselves; don't re-add it to git.

## Architecture

**Static content data files, not a CMS or backend.** The whole site is React components in `src/components/` rendering data from plain JS modules in `src/data/`. To change site content, edit data files, not components (see README.md for the full editing guide, which is accurate and worth reading).

**Documents are filesystem-driven, not hand-declared.** `scripts/generate-documents-manifest.mjs` scans `public/documents/<discipline-slug>/` (recursively) and writes `src/data/documentsManifest.js`, mapping each discipline slug to a sorted list of `{ group, title, url }`. Subfolders become a "group" label (e.g. `public/documents/maths/annales/2024.pdf` → group "Annales"). This script runs automatically via the `predev`/`prebuild` npm hooks — adding a document to the site is just dropping a file under `public/documents/<slug>/` and committing/pushing; no code change needed. By contrast, **videos are declared manually** in `resources.videos` inside `src/data/disciplines.js` (or `src/data/generalResources.js`), since they're external links (YouTube, Drive, etc.) rather than files in `public/`.

**Discipline identity has two keys**: `code` (e.g. `"MAT (5h30)"`, used as the filter key and displayed as a short label) and `slug` (e.g. `"maths"`, used to look up documents in `documentsManifest` and as the `public/documents/<slug>/` folder name). Both are defined per-discipline in `src/data/disciplines.js`.

**Data flow for the resources section**: `App.jsx` holds `activeCode` state (which discipline, if any, is selected). Clicking a discipline card in `Disciplines.jsx` calls `onSelect(code)`, which toggles `activeCode` and smooth-scrolls to `#ressources`. `Resources.jsx` filters `disciplines` by `activeCode`, and for each shown discipline merges its manually-declared `videos` with its auto-generated `files` (from `documentsManifest[slug]`). When no filter is active, a "Général" section (from `generalResources.js`) is also shown.

**Styling**: Tailwind v4 with the theme defined via `@theme` in `src/index.css` (no `tailwind.config.js`) — custom color tokens `encre` (navy ink), `velin` (parchment background), `bronze` and `sauge` (accents), plus custom font tokens (`Fraunces` display, `Inter` body, `IBM Plex Mono` mono). Use these tokens instead of introducing new colors/fonts.

## Deployment

Two independent, parallel deployment paths exist for this repo — check which one is relevant before assuming CI/CD behavior:

- **Docker/GHCR**: `.github/workflows/docker-build-push.yml` builds and pushes a Docker image to `ghcr.io/<repo>` on every push to `main`. The `Dockerfile` is a two-stage build (Node build → static `dist/` served by `nginx.conf`, which does SPA fallback to `index.html` and long-cache on `/assets/`).
- **Netlify**: `netlify.toml` runs `npm run build` and publishes `dist/`. Since `prebuild` regenerates the documents manifest from whatever is in `public/documents/`, a Netlify rebuild is enough to pick up newly committed documents — this is the documented way editors publish new files without a code change.

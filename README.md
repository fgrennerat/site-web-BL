# Prépa B/L — Lycée Mounier

Site de communication pour la classe préparatoire B/L, avec présentation de la
filière et une page par matière hébergeant ses ressources (vidéos, documents).

Stack : **Vite + React (JS) + Tailwind CSS v4** pour le site, et une petite
**API Node/Express** pour gérer les ressources (upload/suppression protégés
par un jeton d'admin, listées à l'exécution depuis un volume — pas de base
de données).

## Démarrer

```bash
npm install
ADMIN_TOKEN=un-secret-local npm run dev
```

`npm run dev` lance en parallèle le serveur Vite (http://localhost:5173) et
l'API locale (port 3001, données dans `data/resources/`, gitignoré). Vite
proxifie `/api` et `/resources` vers l'API — voir `vite.config.js`.

`ADMIN_TOKEN` est le mot de passe de la page `/admin`. Sans lui, l'API
démarre quand même mais refuse toute requête d'écriture.

Pour générer la version de production :

```bash
npm run build
```

Le résultat est généré dans `dist/` — mais ce n'est que la moitié statique du
site : voir [Déploiement](#déploiement) ci-dessous, l'API doit tourner à côté.

## Modifier le contenu

- **Identité des matières** (nom, badge, couleur d'accent, description de
  repli) : `src/data/disciplines.js`. Ajouter une matière ici lui crée
  automatiquement sa page `/<slug>`.
- **Description, professeur, vidéos, documents de chaque matière** : ne se
  modifient plus dans le code. Tout se gère à l'exécution depuis `/admin`
  (jeton requis), et s'enregistre automatiquement à la frappe/à la sélection
  (pas de bouton "Enregistrer" à chercher) :
  - la **description** et le **nom du professeur** affichés sur la page
    `/<slug>` remplacent la description de repli de `disciplines.js` dès
    qu'ils sont saisis (le professeur s'affiche sous le nom de la matière,
    dans la couleur d'accent de la discipline) ;
  - les **sections** sont purement une notion de config, pas des dossiers :
    on les crée par leur nom depuis `/admin` (un identifiant est généré
    automatiquement), on les réordonne à la souris (glisser-déposer), et on
    y rattache ensuite fichiers et vidéos individuellement via un menu
    déroulant. Les documents sont tous stockés à plat sur le disque —
    renommer/réorganiser les sections ne déplace jamais rien.
  - les **vidéos** (lien YouTube, Drive...) s'ajoutent/se retirent depuis
    l'écran d'administration, et peuvent optionnellement être rattachées à
    une section ;
  - les **documents** s'envoient (upload, plusieurs fichiers à la fois — une
    requête par fichier) et se suppriment depuis le même écran, avec une
    section optionnelle choisie au moment de l'envoi (modifiable ensuite).
  - Rien n'est rattaché à une section par défaut : ce qui n'a pas de section
    s'affiche quand même, juste sans titre de section, en tête de page.
  - Les ressources non liées à une matière ("Général", affiché sur
    l'accueil juste après la grille des disciplines) se gèrent de la même
    façon, sous l'entrée "Général" de `/admin`.
- **Texte d'accroche / présentation** : `src/components/Hero.jsx` et
  `src/components/Presentation.jsx`.
- **Coordonnées de contact** : `src/components/Footer.jsx`.
- **Vie étudiante (voyages, photos, vidéos)** : `src/data/studentLife.js`.
  Déposez vos photos dans `public/images/vie-etudiante/` puis référencez-les
  avec `{ src: "/images/vie-etudiante/mon-fichier.jpg", alt: "..." }`. Sans
  photo fournie, un encart "Photo à venir" s'affiche automatiquement.
- **Témoignages d'anciens élèves** : `src/data/testimonials.js` — nom,
  promotion, parcours et citation pour chaque témoignage.
- **Couleurs et polices** : variables définies dans `src/index.css`
  (`@theme { ... }`) — encre (bleu nuit), vélin (fond), bronze et sauge
  (accents).

## Structure

```
src/
  components/   Nav, Hero, Presentation, Disciplines, DisciplineCard,
                ResourceSections, GeneralResources, Footer...
  pages/        Home, SubjectPage (/<slug>), AdminPage (/admin), NotFound
  data/         disciplines.js (identité des matières, éditable)
  index.css     thème Tailwind (couleurs, polices)
  App.jsx       déclaration des routes
server/
  index.mjs     API Express (lecture publique, écriture protégée par jeton)
  lib/resources.mjs  scan disque + fusion avec .config.json
data/resources/ (gitignoré, généré) — un dossier par matière, fichiers à
plat, sections purement virtuelles (dans .config.json) :
  maths/.config.json    description, professeur, sections[], vidéos[], titres/sections par fichier
  maths/programme.pdf
  maths/2024.pdf         → section "Annales" si files["2024.pdf"].section === "annales"
```

Cliquer sur une matière dans la grille "Les disciplines" ouvre sa page
dédiée (`/<slug>`).

## Déploiement

Le site n'est déployable qu'en conteneur Docker auto-hébergé (Netlify a été
abandonné : pas de disque persistant ni de process serveur pour héberger le
volume et l'API d'admin).

Une image est construite et poussée sur GHCR à chaque push sur `main`
(`.github/workflows/docker-build-push.yml`). Un `docker-compose.yml`
d'exemple est fourni :

```bash
ADMIN_TOKEN=un-secret-long-et-aleatoire docker compose up -d
```

Le volume nommé `resources` conserve les documents/vidéos uploadés d'un
redéploiement à l'autre. Un conteneur neuf démarre avec un volume vide : les
documents qui vivaient dans `public/documents/` avant l'ajout de cette
fonctionnalité ont été migrés une fois pour toutes vers `data/resources/`
(gitignoré — voir `scripts/migrate-resources-to-volume.mjs`, à ne relancer
qu'en cas de nouvelle migration). Avant le tout premier démarrage en
production, copiez ce dossier local dans le volume, par exemple :

```bash
docker run --rm -v resources:/dest -v "$PWD/data/resources":/src:ro \
  alpine cp -a /src/. /dest/
```

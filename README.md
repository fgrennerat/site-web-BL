# Prépa B/L — Lycée Mounier

Site de communication pour la classe préparatoire B/L, avec présentation de la
filière et ressources (vidéos, documents) organisées par discipline.

Stack : **Vite + React (JS) + Tailwind CSS v4**.

## Démarrer

```bash
npm install
npm run dev
```

Le site est alors disponible sur http://localhost:5173

Pour générer la version de production :

```bash
npm run build
```

Le résultat est généré dans `dist/`, prêt à être déposé sur n'importe quel
hébergement statique (Netlify, Vercel, GitHub Pages, serveur du lycée...).

## Modifier le contenu

- **Disciplines et ressources** : tout se trouve dans
  `src/data/disciplines.js`. Chaque discipline a un titre, une description,
  et deux listes (`videos`, `files`) avec `title` + `url`. Remplacez les
  `url: "#"` par vos vrais liens (YouTube, Drive, Dropbox...).
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

\`\`\`
src/
  components/   Nav, Hero, Presentation, Disciplines, DisciplineCard, Resources, Footer
  data/         disciplines.js (contenu éditable)
  index.css     thème Tailwind (couleurs, polices)
  App.jsx       assemblage de la page
\`\`\`

Cliquer sur une discipline dans la grille filtre automatiquement la section
Ressources sur cette matière (cliquer à nouveau, ou "Voir toutes les
matières", réinitialise le filtre).

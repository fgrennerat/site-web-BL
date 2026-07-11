// Modifiez ce fichier pour ajuster les matières et leur description.
//
// Les DOCUMENTS ne se déclarent plus ici : déposez simplement vos fichiers
// dans public/documents/<slug>/ (le "slug" de chaque discipline est indiqué
// ci-dessous) — ils apparaîtront automatiquement sur le site après un
// "git push" (Netlify régénère la liste à chaque déploiement).
//
// Les VIDÉOS restent à déclarer ici manuellement (lien YouTube, Drive...),
// car elles ne sont pas hébergées dans public/.

export const disciplines = [
  {
    code: "MAT (5h30)",
    name: "Mathématiques",
    slug: "maths",
    accent: "encre",
    description:
      "Algèbre linéaire, analyse, et probabilités : des outils formels qui structurent le raisonnement.",
    resources: {
      videos: [
        {
          title: "Introduction à l'algèbre linéaire",
          url: "https://www.3blue1brown.com/?search=linear+algebra&lesson=eola-preview",
        },
      ],
    },
  },
  {
    code: "SES (6h)",
    name: "Sciences économiques et sociales",
    slug: "ses",
    accent: "bronze",
    description:
      "Économie et sociologie : comprendre les mécanismes économiques et les dynamiques sociales contemporaines.",
    resources: { videos: [] },
  },
  {
    code: "LET (4h)",
    name: "Lettres",
    slug: "lettres",
    accent: "bronze",
    description:
      "Littérature française et comparée : l'analyse littéraire au service d'une culture générale exigeante.",
    resources: { videos: [] },
  },
  {
    code: "PHI (4h)",
    name: "Philosophie",
    slug: "philo",
    accent: "sauge",
    description:
      "Une formation à l'exigence conceptuelle, de la lecture des textes classiques à la dissertation.",
    resources: { videos: [] },
  },
  {
    code: "HIS (4h)",
    name: "Histoire",
    slug: "histoire",
    accent: "encre",
    description: "Histoire du monde contemporain.",
    resources: { videos: [] },
  },
  {
    code: "LV1 (4h)",
    name: "Anglais (LV1)",
    slug: "anglais",
    accent: "sauge",
    description:
      "Anglais et deuxième langue vivante : maîtrise linguistique et ouverture aux cultures étrangères.",
    resources: { videos: [] },
  },
  {
    code: "LV2 (2h)",
    name: "Langue vivante 2",
    slug: "lv2",
    accent: "encre",
    description: "Allemand / espagnol / italien / arabe / chinois",
    resources: { videos: [] },
  },
  {
    code: "GEO (4h)",
    name: "Géographie - géopolitique",
    slug: "geo",
    accent: "bronze",
    description: "Enjeux géopolitiques, en lien direct avec l'actualité.",
    resources: { videos: [] },
  },
  {
    code: "CG (2h)",
    name: "Culture générale",
    slug: "culture-generale",
    accent: "sauge",
    description:
      "Un enseignement transversal qui articule les autres disciplines et prépare à l'épreuve de culture générale des concours.",
    resources: { videos: [] },
  },
  {
    code: "EPS (2h)",
    name: "Sport",
    slug: "eps",
    accent: "sauge",
    description: " ",
    resources: { videos: [] },
  },
];

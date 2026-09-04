// Identité et description "par défaut" de chaque matière.
//
// La description ci-dessous n'est qu'un repli : une fois qu'un admin a
// enregistré une description via /admin, c'est elle qui s'affiche (stockée
// dans le volume, pas ici). Les vidéos et documents ne se déclarent plus
// dans ce fichier non plus : ils se gèrent entièrement depuis /admin.
//
// "code" sert de badge court affiché sur les cartes. "slug" sert à la fois
// d'URL de la page matière (/<slug>) et de nom de dossier de ressources.
//
// Clés optionnelles :
//   path     URL de la page si elle diffère de /<slug> (ex. /lv2/allemand
//            pour le slug "lv2-allemand" : les slugs restent plats, c'est
//            aussi le nom de dossier de ressources).
//   hidden   la matière n'apparaît pas dans la grille de l'accueil (elle
//            reste accessible par son URL et depuis /admin).
//   related  slugs des pages liées, affichées en sommaire sur la page.

export const disciplines = [
  {
    code: "MAT (5h30)",
    name: "Mathématiques",
    slug: "maths",
    accent: "encre",
    description:
      "Algèbre linéaire, analyse, et probabilités : des outils formels qui structurent le raisonnement.",
  },
  {
    code: "SES (6h)",
    name: "Sciences économiques et sociales",
    slug: "ses",
    accent: "bronze",
    description:
      "Économie et sociologie : comprendre les mécanismes économiques et les dynamiques sociales contemporaines.",
  },
  {
    code: "LET (4h)",
    name: "Lettres",
    slug: "lettres",
    accent: "bronze",
    description:
      "Littérature française et comparée : l'analyse littéraire au service d'une culture générale exigeante.",
  },
  {
    code: "PHI (4h)",
    name: "Philosophie",
    slug: "philo",
    accent: "sauge",
    description:
      "Une formation à l'exigence conceptuelle, de la lecture des textes classiques à la dissertation.",
  },
  {
    code: "HIS (4h)",
    name: "Histoire",
    slug: "histoire",
    accent: "encre",
    description: "Histoire du monde contemporain.",
  },
  {
    code: "LV1 (4h)",
    name: "Anglais (LV1)",
    slug: "anglais",
    accent: "sauge",
    description:
      "Anglais et deuxième langue vivante : maîtrise linguistique et ouverture aux cultures étrangères.",
  },
  {
    code: "LV2 (2h)",
    name: "Langue vivante 2",
    slug: "lv2",
    accent: "encre",
    description: "Allemand / espagnol / italien / arabe / chinois",
    // Les trois LV2 principales ont chacune leur propre page : la page /lv2
    // sert de sommaire et renvoie vers elles (voir SubjectPage.jsx).
    related: [
      "lv2-allemand",
      "lv2-espagnol",
      "lv2-italien",
      "lv2-arabe",
      "lv2-chinois",
    ],
  },
  {
    code: "LV2 (2h)",
    name: "Allemand",
    slug: "lv2-allemand",
    path: "/lv2/allemand",
    accent: "encre",
    hidden: true,
    description: "",
  },
  {
    code: "LV2 (2h)",
    name: "Espagnol",
    slug: "lv2-espagnol",
    path: "/lv2/espagnol",
    accent: "bronze",
    hidden: true,
    description: "",
  },
  {
    code: "LV2 (2h)",
    name: "Italien",
    slug: "lv2-italien",
    path: "/lv2/italien",
    accent: "sauge",
    hidden: true,
    description: "",
  },
  {
    code: "LV2 (2h)",
    name: "Arabe",
    slug: "lv2-arabe",
    path: "/lv2/arabe",
    accent: "encre",
    hidden: true,
    description: "",
  },
  {
    code: "LV2 (2h)",
    name: "Chinois",
    slug: "lv2-chinois",
    path: "/lv2/chinois",
    accent: "bronze",
    hidden: true,
    description: "",
  },
  {
    code: "GEO (4h)",
    name: "Géographie - géopolitique",
    slug: "geo",
    accent: "bronze",
    description: "Enjeux géopolitiques, en lien direct avec l'actualité.",
  },
  {
    code: "EPS (2h)",
    name: "Sport",
    slug: "eps",
    accent: "sauge",
    description: " ",
  },
  {
    code: "CG (2h)",
    name: "Culture générale",
    slug: "culture-generale",
    accent: "sauge",
    description:
      "Un enseignement transversal qui articule les autres disciplines et prépare à l'épreuve de culture générale des concours.",
  },
  {
    code: "EXTRA",
    name: "Chorale",
    slug: "chorale",
    accent: "bronze",
    description: "Pratique du chant choral.",
  },
];

// URL de la page d'une matière : "path" si elle est déclarée, /<slug> sinon.
export function disciplinePath(discipline) {
  return discipline.path || `/${discipline.slug}`;
}

export function findDisciplineByPath(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return disciplines.find((d) => disciplinePath(d) === clean);
}

export function findDisciplineBySlug(slug) {
  return disciplines.find((d) => d.slug === slug);
}

// Identité et description "par défaut" de chaque matière.
//
// La description ci-dessous n'est qu'un repli : une fois qu'un admin a
// enregistré une description via /admin, c'est elle qui s'affiche (stockée
// dans le volume, pas ici). Les vidéos et documents ne se déclarent plus
// dans ce fichier non plus : ils se gèrent entièrement depuis /admin.
//
// "code" sert de badge court affiché sur les cartes. "slug" sert à la fois
// d'URL de la page matière (/<slug>) et de nom de dossier de ressources.

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
  },
  {
    code: "GEO (4h)",
    name: "Géographie - géopolitique",
    slug: "geo",
    accent: "bronze",
    description: "Enjeux géopolitiques, en lien direct avec l'actualité.",
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
    code: "EPS (2h)",
    name: "Sport",
    slug: "eps",
    accent: "sauge",
    description: " ",
  },
];

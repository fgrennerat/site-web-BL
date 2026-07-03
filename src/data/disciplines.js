// Modifiez ce fichier pour ajuster les matières, descriptions et ressources.
// Chaque ressource "video" doit pointer vers un lien (YouTube, Peertube, Drive...).
// Chaque ressource "file" doit pointer vers un PDF / document (lien Drive, Dropbox...).

export const disciplines = [
  {
    code: "MAT",
    name: "Mathématiques",
    accent: "encre",
    description:
      "Algèbre linéaire, analyse, et probabilités : des outils formels qui structurent le raisonnement.",
    resources: {
      
      files: [
        { title: "Programme et progression", url: "https://nuage03.apps.education.fr/index.php/s/7qa9MwmT2p8RppE" },
         { src: "/images/maths/dancing_math.pdf", alt: "Fonctions qui dansent !" },
        //{ title: "Fiches de méthode", url: "#" },
      ],
      videos: [{ title: "xxx", url: "#" }],
    },
  },
  {
    code: "SES",
    name: "Sciences économiques et sociales",
    accent: "bronze",
    description:
      "Économie et sociologie : comprendre les mécanismes économiques et les dynamiques sociales contemporaines.",
    resources: {
      videos: [{ title: "Cours introductif — À compléter", url: "#" }],
      files: [{ title: "Bibliographie de rentrée", url: "#" }],
    },
  },

  {
    code: "LET",
    name: "Lettres",
    accent: "bronze",
    description:
      "Littérature française et comparée : l'analyse littéraire au service d'une culture générale exigeante.",
    resources: {
      videos: [],
      files: [{ title: "Liste de lectures d'été", url: "#" }],
    },
  },

  {
    code: "PHI",
    name: "Philosophie",
    accent: "sauge",
    description:
      "Une formation à l'exigence conceptuelle, de la lecture des textes classiques à la dissertation.",
    resources: {
      videos: [],
      files: [{ title: "Œuvres au programme", url: "#" }],
    },
  },
  
  {
    code: "HIS",
    name: "Histoire",
    accent: "encre",
    description:
      "Histoire du monde contemporain.",
    resources: {
      videos: [],
      files: [{ title: "Chronologie de référence", url: "#" }],
    },
  },
  {
    code: "LV1",
    name: "Anglais (LV1)",
    accent: "sauge",
    description:
      "Anglais et deuxième langue vivante : maîtrise linguistique et ouverture aux cultures étrangères.",
    resources: {
      videos: [],
      files: [],
    },
  },
  {
    code: "LV2",
    name: "Langue vivante 2",
    accent: "encre",
    description:
      "Allemand / espagnol / italien / arabe / chinois ",
    resources: {
      videos: [{ title: "xxx", url: "#" }],

      files: [
        { title: "Programme et progression", url: "#" },
        //{ title: "Fiches de méthode", url: "#" },
      ],
    },
  },
  {
    code: "GEO",
    name: "Géographie - géopolitique",
    accent: "bronze",
    description:
      "Enjeux géopolitiques, en lien direct avec l'actualité.",
    resources: {
      videos: [{ title: "Cours introductif — À compléter", url: "#" }],
      files: [{ title: "Bibliographie de rentrée", url: "#" }],
    },
  },
  {
    code: "EPS",
    name: "Sport",
    accent: "sauge",
    description:
      "xxx",
    resources: {
      videos: [{ title: "xxx", url: "#" }],
      files: [{ title: "xxx", url: "#" }],
    },
  },
];

// Modifiez ce fichier pour ajuster les matières, descriptions et ressources.
// Chaque ressource "video" doit pointer vers un lien (YouTube, Peertube, Drive...).
// Chaque ressource "file" doit pointer vers un PDF / document (lien Drive, Dropbox...).

export const disciplines = [
  {
    code: "MAT (5h30)",
    name: "Mathématiques",
    accent: "encre",
    description:
      "Algèbre linéaire, analyse, et probabilités : des outils formels qui structurent le raisonnement.",
    resources: { 
      files: [
        { title: "Programme et progression", url: "/documents/maths/programme-mathsBL.pdf" },
        { title: "Cahier de calcul" , url: "documents/maths/cahier_de_calcul_HKBL.pdf"},
        { title: "Chapitre AN1 (analyse)" , url: "documents/maths/AN1-cours-IMP.pdf"},
        { title: "Fonctions dansantes" , url: "/images/maths/dancing_math.pdf"},
        //{ title: "Fiches de méthode", url: "#" },
      ],
     videos: [
      { title: "Introduction à l'algèbre linéaire", url: "https://www.3blue1brown.com/?search=linear+algebra&lesson=eola-preview" }
    ],
    },
  },
  {
    code: "SES (6h)",
    name: "Sciences économiques et sociales",
    accent: "bronze",
    description:
      "Économie et sociologie : comprendre les mécanismes économiques et les dynamiques sociales contemporaines.",
    resources: {
      videos: [
        //{ title: "Cours introductif — À compléter", url: "#" }
      ],
      files: [
        //{ title: "Bibliographie de rentrée", url: "#" }
      ],
    },
  },

  {
    code: "LET (4h)",
    name: "Lettres",
    accent: "bronze",
    description:
      "Littérature française et comparée : l'analyse littéraire au service d'une culture générale exigeante.",
    resources: {
      videos: [ ],
      files: [
        //{ title: "Liste de lectures d'été", url: "#" }
      ],
    },
  },

  {
    code: "PHI (4h)",
    name: "Philosophie",
    accent: "sauge",
    description:
      "Une formation à l'exigence conceptuelle, de la lecture des textes classiques à la dissertation.",
    resources: {
      videos: [ ],
      files: [ ],
    },
  },
  
  {
    code: "HIS (4h)",
    name: "Histoire",
    accent: "encre",
    description:
      "Histoire du monde contemporain.",
    resources: {
      videos: [  ],
      files: [
        //{ title: "Chronologie de référence", url: "#" }
      ],
    },
  },
  {
    code: "LV1 (4h)",
    name: "Anglais (LV1)",
    accent: "sauge",
    description:
      "Anglais et deuxième langue vivante : maîtrise linguistique et ouverture aux cultures étrangères.",
    resources: {
      videos: [ ],
      files: [ ],
    },
  },
  {
    code: "LV2 (2h)",
    name: "Langue vivante 2",
    accent: "encre",
    description:
      "Allemand / espagnol / italien / arabe / chinois ",
    resources: {
      videos: [ ],

      files: [
              //{ title: "Fiches de méthode", url: "#" },
      ],
    },
  },
  {
    code: "GEO (4h)",
    name: "Géographie - géopolitique",
    accent: "bronze",
    description:
      "Enjeux géopolitiques, en lien direct avec l'actualité.",
    resources: {
      videos:  [ ],
      files: [
        //{ title: "Bibliographie de rentrée", url: "#" }
      ],
    },
  },
  {
    code: "EPS (2h)",
    name: "Sport",
    accent: "sauge",
    description:
      " ",
    resources: {
      videos: [ ],
      files: [ ],
    },
  },
];

// Modifiez ce fichier pour ajouter vos voyages / sorties.
// Pour les photos : déposez vos images dans /public/images/vie-etudiante/
// puis référencez-les ici avec le chemin "/images/vie-etudiante/nom-fichier.jpg"
// Pour les vidéos : lien YouTube, Peertube, Drive...

export const trips = [
  {
    title: "Voyage à Paris 2026",
    date: "Juin 2026",
    description:
      "Séjour culturel ...",
    photos: [
       { src: "/images/vie-etudiante/Paris26-1.jpg", alt: "GroupeHK" },
    ],
    video: null, // { title: "Récap du voyage", url: "#" }
  },
    {
    title: "Désinté.",
    date: "Juin 2025",
    description:
      "Rafting à St Pierre de Boeuf",
    photos: [
       { src: "/images/vie-etudiante/Raft26-1.jpg", alt: "camp" },
    ],
    video: null, // { title: "Récap du voyage", url: "#" }
  },
  // {
  //   title: "Sorties théâtre",
  //   date: "À compléter",
  //   description: "À compléter.",
  //   photos: [],
  //   video: null,
  // },
];

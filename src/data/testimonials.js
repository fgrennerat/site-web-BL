// Modifiez ce fichier pour ajouter des témoignages d'anciens élèves.

export const testimonials = [
  {
    name: "Lara",
    promotion: "Promotion 2025",
    path: "en master de sociologie",
    quote: "La prépa ? Une multitude de savoirs appliquables dans une multitude de situations... Une fabuleuse expérience pour tous ceux qui ont soif d'apprendre.",
    
    video: {
      title: "Témoignage vidéo",
      url: "https://drive.google.com/file/d/17rDCRQptFygmoQEp3m4AO6fu_QcOEDCL/view?usp=sharing",
      thumbnail: "/images/temoignages/Lara.png",
      },
  },
  {
    name: "Eva",
    promotion: "Promotion 2025",
    path: "Science Po Lille, en double cursus franco-italien",
    quote:
      "Chercher à comprendre l'origine des choses... De superbes rencontres... Faut y aller !",
    thumbnail: "/images/temoignages/Eva.png",
    video: {
      title: "Témoignage vidéo",
      url: "https://drive.google.com/file/d/14lFr7l_H_zwlQ1lLGxQoiYKZO6xBlUI1/view?usp=sharing",
      thumbnail: "/images/temoignages/Eva.png",
    },
  },

  {
    name: "Hugo",
    promotion: "Promotion 2024",
    //path: "Lettre",
    quote: "Lettre sur la beauté de son expérience en CPGE BL au LPO E. Mounier.",
    files: [
        { title: "Cahier de calcul" , url: "documents/maths/cahier_de_calcul_HKBL.pdf"},
        { title: "Chapitre AN1 (analyse)" , url: "documents/maths/AN1-cours-IMP.pdf"},
        { title: "Fonctions dansantes" , url: "/images/maths/dancing_math.pdf"},
        //{ title: "Fiches de méthode", url: "#" },
      ],
    document: {
      title: "sur la beauté de son expérience en CPGE BL au LPO E. Mounier",
      //file: "https://drive.google.com/file/d/17rDCRQptFygmoQEp3m4AO6fu_QcOEDCL/view?usp=sharing",
      url: "/images/temoignages/Hugo.pdf",
      },
  },

];

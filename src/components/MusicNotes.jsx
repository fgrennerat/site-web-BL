// Ornement décoratif de la page Chorale : les quatre premières mesures de
// l'Ode à la joie (Beethoven, domaine public), tracées en `currentColor`
// pour reprendre la couleur d'accent de la page (voir `decor: "musique"`
// dans disciplines.js). aria-hidden : rien à annoncer aux lecteurs d'écran.

// Portée : cinq lignes, de haut en bas. La ligne du milieu décide du sens
// des hampes, et la 2e ligne en partant du bas (y = 70) porte le sol.
const STAVE = [34, 46, 58, 70, 82];
const MIDDLE = STAVE[2];

const STEM = 32; // longueur de hampe
const STEM_DX = 7; // la hampe part du bord de la tête

// Clé de sol, d'un seul trait : crochet du bas, hampe qui monte, boucle du
// haut, grande panse, puis la spirale qui s'enroule sur la ligne du sol.
const CLEF = [
  "M 9 105",
  "C 19 110 28 104 27 93",
  "C 26 76 24 57 25 41",
  "C 26 29 27 21 30 14",
  "C 24 18 15 28 13 43",
  "C 11 58 13 74 24 85",
  "C 34 93 41 81 37 70",
  "C 34 61 24 59 20 66",
  "C 17 72 22 76 26 71",
].join(" ");

// Hauteur de chaque degré sur la portée (ligne ou interligne).
const PITCH = { do: 76, re: 70, mi: 64, fa: 58, sol: 52 };

// Ode à la joie, quatre premières mesures. La durée sert à la fois à
// espacer les notes et à choisir leur dessin (noire, croche, blanche...).
const MELODY = [
  ["mi", 1], ["mi", 1], ["fa", 1], ["sol", 1],
  ["sol", 1], ["fa", 1], ["mi", 1], ["re", 1],
  ["do", 1], ["do", 1], ["re", 1], ["mi", 1],
  ["mi", 1.5], ["re", 0.5], ["re", 2],
];

// Chiffre de mesure : le 4 du haut centré entre la 1re et la 3e ligne,
// celui du bas entre la 3e et la 5e.
const TIME_X = 56;
const TIME_Y = [(STAVE[0] + STAVE[2]) / 2, (STAVE[2] + STAVE[4]) / 2];

const FIRST_X = 88;
const BEAT = 32; // largeur d'un temps
const MIN_ADVANCE = 26; // sinon la croche se colle à la note suivante

// Position de chaque note, par cumul des durées : l'espacement suit la
// durée, avec un minimum pour que deux têtes ne se chevauchent pas.
let cursor = FIRST_X;
const NOTES = MELODY.map(([degree, beats]) => {
  const note = { beats, x: cursor, y: PITCH[degree] };
  cursor += Math.max(beats * BEAT, MIN_ADVANCE);
  return note;
});

const STAVE_END = NOTES[NOTES.length - 1].x + 2 * BEAT + 14;

// Barres de mesure : la mesure change avant les notes 5, 9 et 13, et la
// barre se pose à mi-chemin entre les deux notes qu'elle sépare.
const BARS = [4, 8, 12].map((i) => (NOTES[i - 1].x + NOTES[i].x) / 2);

function Note({ beats, x, y }) {
  // Sous la ligne du milieu, hampe vers le haut à droite de la tête ;
  // au-dessus (et sur la ligne), vers le bas à gauche.
  const up = y > MIDDLE;
  const stemX = up ? x + STEM_DX : x - STEM_DX;
  const stemEnd = up ? y - STEM : y + STEM;
  const hollow = beats >= 2; // blanche
  const dotted = beats === 1.5;
  const flagged = beats < 1; // croche
  // Un point posé sur une ligne se décale dans l'interligne du dessus.
  const dotY = STAVE.includes(y) ? y - 6 : y;

  return (
    <g>
      <ellipse
        cx={x}
        cy={y}
        rx="7.5"
        ry="5.5"
        fill={hollow ? "none" : "currentColor"}
        stroke={hollow ? "currentColor" : "none"}
        strokeWidth="2.2"
        transform={`rotate(-18 ${x} ${y})`}
      />
      <line x1={stemX} y1={y} x2={stemX} y2={stemEnd} stroke="currentColor" strokeWidth="1.6" />
      {dotted && <circle cx={x + 14} cy={dotY} r="2" fill="currentColor" />}
      {flagged && (
        <path
          d={`M ${stemX} ${stemEnd} C ${stemX + 10} ${stemEnd + 6} ${stemX + 11} ${stemEnd + 14} ${stemX + 4} ${stemEnd + 20}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      )}
    </g>
  );
}

export default function MusicNotes({ className = "" }) {
  return (
    <svg
      viewBox="0 0 640 120"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={CLEF}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g
        className="font-display"
        fill="currentColor"
        textAnchor="middle"
        fontSize="30"
        fontWeight="600"
      >
        {TIME_Y.map((y) => (
          <text key={y} x={TIME_X} y={y} dominantBaseline="central">
            4
          </text>
        ))}
      </g>

      <g stroke="currentColor" fill="none" strokeWidth="1">
        {STAVE.map((y) => (
          <line key={y} x1="0" y1={y} x2={STAVE_END} y2={y} />
        ))}
        {BARS.map((x) => (
          <line key={x} x1={x} y1={STAVE[0]} x2={x} y2={STAVE[4]} />
        ))}
        {/* Double barre finale. */}
        <line x1={STAVE_END - 8} y1={STAVE[0]} x2={STAVE_END - 8} y2={STAVE[4]} />
        <line x1={STAVE_END - 1} y1={STAVE[0]} x2={STAVE_END - 1} y2={STAVE[4]} strokeWidth="3" />
      </g>

      {NOTES.map((n) => (
        <Note key={n.x} {...n} />
      ))}
    </svg>
  );
}

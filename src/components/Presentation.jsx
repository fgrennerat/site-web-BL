const stats = [
  { label: "Années de formation", 
    value: "2 ans" },
  //{ label: "Disciplines majeures", value: "6" },
  { label: "Débouchés", value: "Écoles de commerce, ENS, écoles d'ingénieur, Sciences Po, magistères" },
];

export default function Presentation() {
  return (
    <section id="presentation" className="border-t border-encre/10 bg-velin-dark/40 px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-5">
        <div className="sm:col-span-3">
          <h2 className="font-display text-3xl font-medium text-encre">
            Qu'est-ce que la B/L&nbsp;?
          </h2>
          <p className="mt-6 leading-relaxed text-encre-light">
            La classe préparatoire littéraire B/L (lettres et sciences sociales)
            est la seule filière post-bac à associer, au même niveau d'exigence,
            les mathématiques, l'économie, la sociologie, la philosophie,
            les lettres, et l'histoire.
            Elle s'adresse aux élèves curieux, qui ne veulent pas choisir entre les sciences et les humanités.
            Elle est destinée aux bacheliers de série générale qui ont suivi un enseignement de mathématiques jusqu’en terminale, et toute autre spécialité.
          </p>
          <p className="mt-4 leading-relaxed text-encre-light">
            À l'issue de cette formation, les étudiants intègrent sur concours les grandes
            écoles de commerce et de management, les Écoles normales supérieures, des écoles d'ingénieur (GEIDIC), 
            Sciences Po, ou poursuivent en licence, master, ou magistère universitaire.
          </p>
        </div>

        <dl className="grid gap-6 sm:col-span-2 sm:content-start">
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-bronze/40 pl-4">
              <dt className="font-mono text-xs uppercase tracking-widest text-ardoise">
                {s.label}
              </dt>
              <dd className="mt-1 font-display text-xl text-encre">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-bronze">
          CPGE B/L - Classe préparatoire pluridisciplinaire
        </p>

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-encre sm:text-5xl">
          {/* Penser avec les nombres,
          <br />
          écrire avec les idées. */}
          Classe préparatoire BL du lycée Mounier - Grenoble
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-encre-light">
          La classe préparatoire B/L du lycée Mounier forme, en deux ans, des esprits capables
          de matriser et d'allier la rigueur mathématique, l'analyse économique et
          sociale, et l'exigence littéraire et philosophique.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#ressources"
            className="border border-encre bg-encre px-6 py-3 font-mono text-xs uppercase tracking-widest text-velin transition-colors hover:bg-encre-light"
          >
            Accéder aux ressources
          </a>
          <a
            href="#presentation"
            className="border border-encre/30 px-6 py-3 font-mono text-xs uppercase tracking-widest text-encre transition-colors hover:border-encre"
          >
            Découvrir la filière
          </a>
        </div>

        <div className="mt-12 grid max-w-xl gap-px overflow-hidden border border-encre/15 bg-encre/15 sm:grid-cols-2">
          <a
            href="#vie-etudiante"
            className="group relative flex flex-col gap-1 bg-velin px-5 py-5 transition-colors hover:border-sauge"
          >
            <span className="absolute left-0 top-0 h-full w-1 bg-sauge" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-sauge">
              Voyages · Photos · Vidéos
            </span>
            <span className="flex items-center gap-2 font-display text-lg text-encre">
              Vie étudiante
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </a>

          <a
            href="#temoignages"
            className="group relative flex flex-col gap-1 bg-velin px-5 py-5 transition-colors hover:border-bronze"
          >
            <span className="absolute left-0 top-0 h-full w-1 bg-bronze" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-bronze">
              Parcours d'anciens élèves
            </span>
            <span className="flex items-center gap-2 font-display text-lg text-encre">
              Témoignages
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 hidden h-72 w-72 rounded-full border border-bronze/20 sm:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-32 hidden h-40 w-40 rounded-full border border-sauge/20 sm:block"
      />
    </section>
  );
}

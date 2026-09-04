export default function Footer({ minimal = false }) {
  if (minimal) {
    return (
      <footer className="border-t border-encre/10 px-6 py-4">
        <p className="mx-auto max-w-6xl font-mono text-[11px] text-ardoise/70">
          CPGE B/L — Lycée Emmanuel Mounier
        </p>
      </footer>
    );
  }

  return (
    <footer id="contact" className="border-t border-encre/10 px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl text-encre">Lycée Mounier</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ardoise">
            Une question sur la filière, l'admission ou les enseignements&nbsp;?
            N'hésitez pas à contacter le lycée.
          </p>
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-ardoise">
          <p>
            <a href="mailto:ce.0380032d@ac-grenoble.fr" className="hover:text-bronze">
              ce.0380032d@ac-grenoble.fr
            </a>
          </p>
          <p className="mt-1"> Lycée Emmanuel Mounier,  </p>
          <p className="mt-1"> 6 avenue Marcelin BERTHELOT, 38029 GRENOBLE CEDEX2  </p>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl font-mono text-[11px] text-ardoise/70">
        CPGE B/L — Lycée Emmanuel Mounier
      </p>
    </footer>
  );
}

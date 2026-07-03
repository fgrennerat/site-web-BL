import { disciplines } from "../data/disciplines";

function ResourceGroup({ discipline }) {
  const { videos, files } = discipline.resources;
  const hasContent = videos.length > 0 || files.length > 0;

  return (
    <div className="border-b border-encre/10 py-8 first:pt-0 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tracking-widest text-bronze">
          {discipline.code}
        </span>
        <h3 className="font-display text-xl text-encre">{discipline.name}</h3>
      </div>

      {!hasContent && (
        <p className="mt-3 text-sm italic text-ardoise">
          Ressources à venir.
        </p>
      )}

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {videos.length > 0 && (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ardoise">
              Vidéos
            </p>
            <ul className="mt-2 space-y-2">
              {videos.map((v) => (
                <li key={v.title}>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-encre underline decoration-bronze/40 underline-offset-4 hover:decoration-bronze"
                  >
                    {v.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {files.length > 0 && (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ardoise">
              Documents
            </p>
            <ul className="mt-2 space-y-2">
              {files.map((f) => (
                <li key={f.title}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-encre underline decoration-sauge/40 underline-offset-4 hover:decoration-sauge"
                  >
                    {f.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Resources({ activeCode, onReset }) {
  const filtered = activeCode
    ? disciplines.filter((d) => d.code === activeCode)
    : disciplines;

  return (
    <section id="ressources" className="border-t border-encre/10 bg-velin-dark/40 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-medium text-encre">
            Ressources
          </h2>
          {activeCode && (
            <button
              type="button"
              onClick={onReset}
              className="font-mono text-xs uppercase tracking-widest text-bronze hover:underline"
            >
              Voir toutes les matières
            </button>
          )}
        </div>

        <div className="mt-8">
          {filtered.map((d) => (
            <ResourceGroup key={d.code} discipline={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

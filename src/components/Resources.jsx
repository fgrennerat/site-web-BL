import { disciplines } from "../data/disciplines";
import { generalResources } from "../data/generalResources";
import { documentsManifest } from "../data/documentsManifest";

// Regroupe une liste de fichiers par sous-dossier ("group"), en gardant
// d'abord les fichiers sans sous-dossier (à la racine).
function groupFiles(files) {
  const order = [];
  const byGroup = new Map();

  for (const f of files) {
    const key = f.group || null;
    if (!byGroup.has(key)) {
      byGroup.set(key, []);
      order.push(key);
    }
    byGroup.get(key).push(f);
  }

  order.sort((a, b) => {
    if (a === null) return -1;
    if (b === null) return 1;
    return 0;
  });

  return order.map((key) => [key, byGroup.get(key)]);
}

function ResourceList({ title, videos, files }) {
  const hasContent = videos.length > 0 || files.length > 0;

  return (
    <div className="border-b border-encre/10 py-8 first:pt-0 last:border-b-0">
      <div className="flex items-center gap-3">
        {title.code && (
          <span className="font-mono text-xs tracking-widest text-bronze">
            {title.code}
          </span>
        )}
        <h3 className="font-display text-xl text-encre">{title.name}</h3>
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
            {groupFiles(files).map(([group, groupFiles]) => (
              <div key={group || "_root"} className="mt-2">
                {group && (
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-sauge first:mt-0">
                    {group}
                  </p>
                )}
                <ul className="mt-1 space-y-2">
                  {groupFiles.map((f) => (
                    <li key={f.url}>
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
            ))}
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
          {!activeCode && (
            <ResourceList
              title={{ name: "Général" }}
              videos={generalResources.videos}
              files={generalResources.files}
            />
          )}
          {filtered.map((d) => (
            <ResourceList
              key={d.code}
              title={{ code: d.code, name: d.name }}
              videos={d.resources.videos}
              files={documentsManifest[d.slug] || []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

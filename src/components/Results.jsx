import { useEffect, useState } from "react";
import ResourceSections from "./ResourceSections";

// Rubrique homepage dédiée, gérée comme n'importe quelle autre via /admin
// (voir l'entrée "resultats-concours", hidden, dans data/disciplines.js).
const SLUG = "resultats-concours";

export default function Results() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/resources/${SLUG}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  return (
    <section id="resultats" className="border-t border-encre/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-medium text-encre">
          Résultats concours et poursuite d'études
        </h2>
        {data?.description && (
          <p className="mt-4 max-w-2xl leading-relaxed text-encre-light">{data.description}</p>
        )}

        <div className="mt-10">
          {error && (
            <p className="text-sm italic text-ardoise">
              Impossible de charger les ressources pour le moment.
            </p>
          )}
          {!error && !data && <p className="text-sm italic text-ardoise">Chargement…</p>}
          {data && <ResourceSections videos={data.videos} files={data.files} />}
        </div>
      </div>
    </section>
  );
}

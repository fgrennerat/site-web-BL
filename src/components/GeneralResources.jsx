import { useEffect, useState } from "react";
import ResourceSections from "./ResourceSections";

// Ressources non spécifiques à une matière (emploi du temps, travail de
// rentrée...), gérées comme les autres depuis /admin sous le slug "general".
export default function GeneralResources() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/resources/general")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ videos: [], files: [] }));
  }, []);

  return (
    <section id="ressources" className="border-t border-encre/10 bg-velin-dark/40 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-3xl font-medium text-encre">
          Ressources générales
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ardoise">
          Documents communs à toutes les matières. Les ressources propres à
          chaque discipline sont sur sa page dédiée.
        </p>

        <div className="mt-8">
          {!data && <p className="text-sm italic text-ardoise">Chargement…</p>}
          {data && <ResourceSections videos={data.videos} files={data.files} />}
        </div>
      </div>
    </section>
  );
}

// Rendu partagé vidéos + documents, utilisé sur la page d'accueil
// (ressources générales) et sur chaque page matière. Pas de séparation
// "Vidéos" / "Documents" : les deux se rangent dans les mêmes sections,
// définies par l'admin (dossier à l'upload pour un fichier, "folder" choisi
// pour une vidéo — voir server/lib/resources.mjs). Ce qui n'a pas de
// section s'affiche quand même, juste sans en-tête, en tête de liste.
function buildSections(videos, files) {
  const order = [];
  const byGroup = new Map();
  const unsectioned = [];

  const push = (item, kind) => {
    if (!item.group) {
      unsectioned.push({ ...item, kind });
      return;
    }
    if (!byGroup.has(item.group)) {
      byGroup.set(item.group, { label: item.group, items: [] });
      order.push(item.group);
    }
    byGroup.get(item.group).items.push({ ...item, kind });
  };

  files.forEach((f) => push(f, "file"));
  videos.forEach((v) => push(v, "video"));

  return { unsectioned, sections: order.map((g) => byGroup.get(g)) };
}

const decoration = {
  video: "decoration-bronze/40 hover:decoration-bronze",
  file: "decoration-sauge/40 hover:decoration-sauge",
};

function ItemList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.kind === "file" ? it.path : it.url}>
          <a
            href={it.url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 text-sm text-encre underline underline-offset-4 ${decoration[it.kind]}`}
          >
            {it.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ResourceSections({ videos, files }) {
  const { unsectioned, sections } = buildSections(videos, files);
  const hasContent = unsectioned.length > 0 || sections.length > 0;

  if (!hasContent) {
    return <p className="text-sm italic text-ardoise">Ressources à venir.</p>;
  }

  return (
    <div className="space-y-6">
      {unsectioned.length > 0 && <ItemList items={unsectioned} />}
      {sections.map((s) => (
        <div key={s.label}>
          <p className="font-mono text-[10px] uppercase tracking-wider text-sauge">
            {s.label}
          </p>
          <div className="mt-2">
            <ItemList items={s.items} />
          </div>
        </div>
      ))}
    </div>
  );
}

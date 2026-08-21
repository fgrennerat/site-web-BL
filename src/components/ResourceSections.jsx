// Rendu partagé vidéos + documents, utilisé sur la page d'accueil
// (ressources générales) et sur chaque page matière. D'abord réparti en
// (au plus) 3 grands groupes par année (Général, HK, K — voir
// server/lib/resources.mjs), puis, à l'intérieur de chaque groupe, pas de
// séparation "Vidéos" / "Documents" : les deux se rangent dans les mêmes
// sections, définies par l'admin (dossier à l'upload pour un fichier,
// "folder" choisi pour un lien). Ce qui n'a pas de section s'affiche quand
// même, juste sans en-tête, en tête de liste.
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

function bucketByYear(items) {
  const buckets = { general: [], hk: [], k: [] };
  items.forEach((item) => {
    buckets[item.year === "hk" || item.year === "k" ? item.year : "general"].push(item);
  });
  return buckets;
}

// Un groupe année affiche ses sections (+ le bloc sans section, s'il y en
// a un) sur une grille à 2 colonnes. `heading` est absent pour le groupe
// Général — il reste visuellement "au même niveau" qu'aujourd'hui, seuls
// HK et K reçoivent un vrai titre.
function YearGroup({ heading, videos, files }) {
  const { unsectioned, sections } = buildSections(videos, files);
  const blocks = unsectioned.length > 0 ? [{ label: null, items: unsectioned }, ...sections] : sections;

  if (blocks.length === 0) return null;

  return (
    <div className={heading ? "border-t border-encre/10 pt-8" : undefined}>
      {heading && <h3 className="mb-5 font-display text-xl text-encre">{heading}</h3>}
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {blocks.map((b, i) => (
          <div key={b.label || `_unsectioned-${i}`}>
            {b.label && (
              <p className="font-mono text-[10px] uppercase tracking-wider text-sauge">
                {b.label}
              </p>
            )}
            <div className={b.label ? "mt-2" : undefined}>
              <ItemList items={b.items} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResourceSections({ videos, files }) {
  const hasContent = videos.length > 0 || files.length > 0;

  if (!hasContent) {
    return <p className="text-sm italic text-ardoise">Ressources à venir.</p>;
  }

  const videosByYear = bucketByYear(videos);
  const filesByYear = bucketByYear(files);

  return (
    <div className="space-y-8">
      <YearGroup videos={videosByYear.general} files={filesByYear.general} />
      <YearGroup heading="HK — 1ère année" videos={videosByYear.hk} files={filesByYear.hk} />
      <YearGroup heading="K — 2e année" videos={videosByYear.k} files={filesByYear.k} />
    </div>
  );
}

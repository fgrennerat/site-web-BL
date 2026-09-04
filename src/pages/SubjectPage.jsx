import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  disciplinePath,
  findDisciplineByPath,
  findDisciplineBySlug,
} from "../data/disciplines";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ResourceSections from "../components/ResourceSections";
import NotFound from "./NotFound";

// Classes statiques (pas de `text-${accent}` dynamique : Tailwind ne peut
// détecter que des classes écrites en toutes lettres dans le code).
const accentText = {
  encre: "text-encre",
  bronze: "text-bronze",
  sauge: "text-sauge",
};

const accentBar = {
  encre: "bg-encre",
  bronze: "bg-bronze",
  sauge: "bg-sauge",
};

const accentRing = {
  encre: "hover:border-encre",
  bronze: "hover:border-bronze",
  sauge: "hover:border-sauge",
};

export default function SubjectPage() {
  const { pathname } = useLocation();
  const discipline = findDisciplineByPath(pathname);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!discipline) return;
    setData(null);
    setError(false);
    fetch(`/api/resources/${discipline.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [discipline]);

  if (!discipline) return <NotFound />;

  const description = data?.description || discipline.description;
  // Pages liées (ex. les trois LV2 depuis /lv2) : un slug inconnu est ignoré
  // plutôt que de faire planter la page.
  const related = (discipline.related || []).map(findDisciplineBySlug).filter(Boolean);

  return (
    <div className="min-h-screen bg-velin text-encre">
      <Nav />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-display text-4xl font-medium text-encre">
          {discipline.name}
        </h1>
        {data?.teacher && (
          <p className={`mt-1 font-mono text-sm tracking-wide ${accentText[discipline.accent]}`}>
            {data.teacher}
          </p>
        )}
        {description && (
          <p className="mt-4 max-w-2xl leading-relaxed text-ardoise">{description}</p>
        )}

        {related.length > 0 && (
          <ul className="mt-8 grid gap-px overflow-hidden border border-encre/15 bg-encre/15 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to={disciplinePath(r)}
                  className={`group relative flex h-full flex-col gap-2 border border-encre/15 bg-velin px-5 py-5 transition-colors ${accentRing[r.accent]}`}
                >
                  <span className={`absolute left-0 top-0 h-full w-1 ${accentBar[r.accent]}`} />
                  <span className="font-display text-lg text-encre">{r.name}</span>
                  <span className="font-mono text-xs uppercase tracking-widest text-ardoise">
                    Ressources
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
      </main>
      <Footer minimal />
    </div>
  );
}

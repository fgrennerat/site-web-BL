import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { disciplines } from "../data/disciplines";
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

export default function SubjectPage() {
  const { slug } = useParams();
  const discipline = disciplines.find((d) => d.slug === slug);
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

  return (
    <div className="min-h-screen bg-velin text-encre">
      <Nav />
      <main className="mx-auto max-w-4xl px-6 py-20">
        <Link
          to="/#disciplines"
          className="font-mono text-xs uppercase tracking-widest text-bronze hover:underline"
        >
          ← Retour à l'accueil
        </Link>

        <span className="mt-8 block font-mono text-xs tracking-widest text-bronze">
          {discipline.code}
        </span>
        <h1 className="mt-2 font-display text-4xl font-medium text-encre">
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
      <Footer />
    </div>
  );
}

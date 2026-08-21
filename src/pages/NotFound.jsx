import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-velin text-encre">
      <Nav />
      <main className="mx-auto max-w-4xl px-6 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-bronze">404</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-encre">
          Page introuvable
        </h1>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-encre underline decoration-bronze/40 underline-offset-4 hover:decoration-bronze"
        >
          Retour à l'accueil
        </Link>
      </main>
      <Footer />
    </div>
  );
}

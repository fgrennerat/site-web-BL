import { useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Presentation from "../components/Presentation";
import Disciplines from "../components/Disciplines";
import StudentLife from "../components/StudentLife";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  // Une navigation React Router (ex. le lien "retour" d'une page matière
  // vers "/#disciplines") ne déclenche pas le scroll natif du navigateur
  // vers l'ancre, contrairement à un vrai chargement de page — on le fait
  // donc nous-mêmes au montage.
  useEffect(() => {
    if (!window.location.hash) return;
    // "instant" plutôt que "smooth" : l'anim smooth peut ne jamais aboutir
    // (silencieusement) selon le navigateur/les préférences d'accessibilité
    // de l'utilisateur — un saut immédiat mais garanti vaut mieux qu'une
    // tentative d'animation qui ne scrolle parfois pas du tout.
    document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-velin text-encre">
      <Nav />
      <main>
        <Hero />
        <Presentation />
        <Disciplines />
        <StudentLife />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

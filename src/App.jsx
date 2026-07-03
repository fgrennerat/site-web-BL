import { useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Presentation from "./components/Presentation";
import Disciplines from "./components/Disciplines";
import Resources from "./components/Resources";
import StudentLife from "./components/StudentLife";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

export default function App() {
  const [activeCode, setActiveCode] = useState(null);

  const handleSelect = (code) => {
    setActiveCode((current) => (current === code ? null : code));
    document
      .getElementById("ressources")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-velin text-encre">
      <Nav />
      <main>
        <Hero />
        <Presentation />
        <Disciplines activeCode={activeCode} onSelect={handleSelect} />
        <Resources activeCode={activeCode} onReset={() => setActiveCode(null)} />
        <StudentLife />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

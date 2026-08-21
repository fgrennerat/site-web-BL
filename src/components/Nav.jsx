import { Link } from "react-router-dom";

export default function Nav() {
  const links = [
    { href: "/#presentation", label: "La filière" },
    { href: "/#disciplines", label: "Disciplines" },
    { href: "/#ressources", label: "Ressources" },
    { href: "/#vie-etudiante", label: "Vie étudiante" },
    { href: "/#temoignages", label: "Témoignages" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-encre/10 bg-velin/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-encre">
            Prépa B/L
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-ardoise">
            Mounier
          </span>
        </Link>
        <ul className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-ardoise sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="transition-colors hover:text-bronze"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

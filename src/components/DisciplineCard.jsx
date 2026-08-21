import { Link } from "react-router-dom";

const accentStyles = {
  encre: { bar: "bg-encre", text: "text-encre", ring: "hover:border-encre" },
  bronze: { bar: "bg-bronze", text: "text-bronze", ring: "hover:border-bronze" },
  sauge: { bar: "bg-sauge", text: "text-sauge", ring: "hover:border-sauge" },
};

export default function DisciplineCard({ discipline }) {
  const accent = accentStyles[discipline.accent];

  return (
    <Link
      to={`/${discipline.slug}`}
      className={`group relative flex flex-col gap-3 border border-encre/15 bg-velin px-5 py-6 text-left transition-colors ${accent.ring}`}
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${accent.bar}`} />
      <span className={`font-mono text-xs tracking-widest ${accent.text}`}>
        {discipline.code}
      </span>
      <span className="font-display text-xl text-encre">{discipline.name}</span>
      <span className="text-sm leading-relaxed text-ardoise">
        {discipline.description}
      </span>
    </Link>
  );
}

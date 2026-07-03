const accentStyles = {
  encre: { bar: "bg-encre", text: "text-encre", ring: "group-hover:border-encre" },
  bronze: { bar: "bg-bronze", text: "text-bronze", ring: "group-hover:border-bronze" },
  sauge: { bar: "bg-sauge", text: "text-sauge", ring: "group-hover:border-sauge" },
};

export default function DisciplineCard({ discipline, isActive, onSelect }) {
  const accent = accentStyles[discipline.accent];

  return (
    <button
      type="button"
      onClick={() => onSelect(discipline.code)}
      className={`group relative flex flex-col gap-3 border bg-velin px-5 py-6 text-left transition-colors ${
        isActive ? accent.ring.replace("group-hover:", "") : "border-encre/15"
      } ${accent.ring}`}
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${accent.bar}`} />
      <span className={`font-mono text-xs tracking-widest ${accent.text}`}>
        {discipline.code}
      </span>
      <span className="font-display text-xl text-encre">{discipline.name}</span>
      <span className="text-sm leading-relaxed text-ardoise">
        {discipline.description}
      </span>
    </button>
  );
}

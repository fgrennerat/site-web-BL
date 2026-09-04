import { disciplines } from "../data/disciplines";
import DisciplineCard from "./DisciplineCard";

export default function Disciplines() {
  return (
    <section id="disciplines" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-medium text-encre">
            Disciplines et ressources
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-ardoise">
            Cliquez pour voir les ressources
          </span>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden border border-encre/15 bg-encre/15 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines
            .filter((d) => !d.hidden)
            .map((d) => (
              <DisciplineCard key={d.slug} discipline={d} />
            ))}
        </div>
      </div>
    </section>
  );
}

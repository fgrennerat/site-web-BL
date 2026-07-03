import { trips } from "../data/studentLife";

function PhotoTile({ photo, index }) {
  if (photo?.src) {
    return (
      <img
        src={photo.src}
        alt={photo.alt || ""}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-velin-dark">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ardoise/60">
        Photo {index + 1}
      </span>
    </div>
  );
}

function TripCard({ trip }) {
  const slots = trip.photos.length > 0 ? trip.photos : [null, null, null];

  return (
    <article className="border border-encre/15 bg-velin">
      <div className="grid grid-cols-3 gap-px bg-encre/10">
        {slots.slice(0, 3).map((photo, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <PhotoTile photo={photo} index={i} />
          </div>
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg text-encre">{trip.title}</h3>
          <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-bronze">
            {trip.date}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ardoise">
          {trip.description}
        </p>

        {trip.video && (
          <a
            href={trip.video.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-encre underline decoration-sauge/40 underline-offset-4 hover:decoration-sauge"
          >
            ▶ {trip.video.title}
          </a>
        )}
      </div>
    </article>
  );
}

export default function StudentLife() {
  return (
    <section id="vie-etudiante" className="border-t border-encre/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-medium text-encre">
          Vie étudiante
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ardoise">
          Voyages, sorties et projets de classe — un aperçu de la vie en
          dehors des cours.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.title} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  );
}

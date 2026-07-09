import { testimonials } from "../data/testimonials";

function VideoLink({ video }) {
  if (!video) return null;

  if (video.thumbnail) {
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="group relative mt-4 block aspect-video overflow-hidden border border-encre/15"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-encre/20 transition-colors group-hover:bg-encre/30">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-velin/90 text-bronze shadow-sm transition-transform group-hover:scale-110">
            ▶
          </span>
        </span>
        <span className="absolute bottom-0 left-0 right-0 bg-encre/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-velin">
          {video.title}
        </span>
      </a>
    );
  }

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-encre underline decoration-bronze/40 underline-offset-4 hover:decoration-bronze"
    >
      ▶ {video.title}
    </a>
  );
}

function DocumentLink({ document }) {
  if (!document) return null;

  return (
    <a
      href={document.url}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-encre underline decoration-sauge/40 underline-offset-4 hover:decoration-sauge"
    >
      📄 {document.title}
    </a>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <figure className="relative border-l-2 border-bronze/40 bg-velin-dark/30 p-6">
      <blockquote className="font-display text-lg italic leading-relaxed text-encre">
        « {testimonial.quote} »
      </blockquote>

      <VideoLink video={testimonial.video} />
      <DocumentLink document={testimonial.document} />

      <figcaption className="mt-4 font-mono text-xs uppercase tracking-widest text-ardoise">
        {testimonial.name} — {testimonial.promotion}
        <br />
        <span className="text-bronze">{testimonial.path}</span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section
      id="temoignages"
      className="border-t border-encre/10 bg-velin-dark/40 px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-medium text-encre">
          Témoignages d'anciens élèves
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name + t.promotion} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

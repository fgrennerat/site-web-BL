import { testimonials } from "../data/testimonials";

function TestimonialCard({ testimonial }) {
  return (
    <figure className="relative border-l-2 border-bronze/40 bg-velin-dark/30 p-6">
      <blockquote className="font-display text-lg italic leading-relaxed text-encre">
        « {testimonial.quote} »
      </blockquote>

      {testimonial.video && (
        <a
          href={testimonial.video.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-encre underline decoration-bronze/40 underline-offset-4 hover:decoration-bronze"
        >
          ▶ {testimonial.video.title}
        </a>
      )}

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
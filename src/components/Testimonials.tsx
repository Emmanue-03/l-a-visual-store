import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute left-0 top-32 -z-10 h-32 w-[32rem] -rotate-6 bg-brand-soft blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-10 -z-10 h-32 w-[30rem] rotate-6 bg-brand-gold-soft/50 blur-3xl" />

      <div className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-royal/15 bg-brand-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">
          Testimonios
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-deep sm:text-4xl lg:text-5xl">
          Clientes que <span className="text-gradient-royal">confían</span> en nosotros
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Más de 1.200 reseñas verificadas y contando. Esto es lo que dicen.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="premium-card premium-panel group relative overflow-hidden rounded-2xl p-6 card-hover"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-royal via-brand-gold to-brand-royal opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Quote className="absolute right-4 top-4 h-9 w-9 text-brand-royal/15" />
            <div className="relative flex items-center gap-1 text-amber-500">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current drop-shadow-sm" />
              ))}
            </div>
            <p className="relative mt-4 text-sm leading-relaxed text-foreground/80">"{t.text}"</p>
            <div className="relative mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-royal to-brand-deep text-sm font-bold text-white shadow-md shadow-brand-royal/20 ring-2 ring-white">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-deep">{t.name}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Cliente verificado</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

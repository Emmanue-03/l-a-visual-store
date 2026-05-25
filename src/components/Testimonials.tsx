import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">Testimonios</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-brand-deep sm:text-4xl">
          Clientes que confían en L&A Multiventas
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <div key={t.name} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm card-hover">
            <Quote className="absolute right-4 top-4 h-8 w-8 text-brand-soft" />
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">"{t.text}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-royal to-brand-deep text-sm font-bold text-white">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-deep">{t.name}</div>
                <div className="text-[11px] text-muted-foreground">Cliente verificado</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { Cpu, Home, Refrigerator, Watch, Wrench, Shirt, Flame, Sparkles, ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/mock-data";
import type { Category } from "@/lib/catalog-types";

const iconMap = { Cpu, Home, Refrigerator, Watch, Wrench, Shirt, Flame, Sparkles };

export function CategoriesSection({ items = categories }: { items?: Category[] }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-brand-royal/15 to-transparent lg:inset-x-8" />
      <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-royal/15 bg-brand-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">
            <Sparkles className="h-3.5 w-3.5" />
            Categorías
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-deep sm:text-4xl lg:text-5xl">
            Explorá <span className="text-gradient-royal">por categorías</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Encontrá rápido lo que necesitás entre nuestras secciones más buscadas — todo a un click.
          </p>
        </div>
        <Link
          to="/catalogo"
          className="group inline-flex items-center gap-1.5 rounded-full border border-brand-royal/20 bg-white px-4 py-2 text-sm font-semibold text-brand-royal shadow-sm transition hover:gap-2.5 hover:border-brand-royal/40 hover:shadow-md"
        >
          Ver todo
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {items.map((c, i) => {
          const Icon = iconMap[c.icon as keyof typeof iconMap] ?? Sparkles;
          return (
            <Link
              key={c.slug}
              to="/catalogo"
              search={{ categoria: c.slug }}
              className="premium-card premium-panel group relative overflow-hidden rounded-2xl p-5 card-hover"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-royal via-brand-gold to-brand-royal opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute -right-10 -top-10 h-28 w-28 rotate-12 bg-brand-soft transition-all duration-700 group-hover:scale-150 group-hover:bg-brand-gold-soft/70" />

              <div className="relative flex items-start justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-royal to-brand-deep text-white shadow-lg shadow-brand-royal/25 ring-1 ring-white/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand-deep ring-1 ring-brand-gold/40">
                  {c.count}+
                </span>
              </div>

              <h3 className="relative mt-7 font-display text-lg font-bold leading-tight text-brand-deep">{c.name}</h3>
              <p className="relative mt-1 text-xs text-muted-foreground">Productos seleccionados</p>

              <div className="relative mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-royal opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
                  Ver categoría <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <span className="sr-only">posición {i + 1}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { Cpu, Home, Refrigerator, Watch, Wrench, Shirt, Flame, Sparkles, ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/mock-data";
import type { Category } from "@/lib/catalog-types";

const iconMap = { Cpu, Home, Refrigerator, Watch, Wrench, Shirt, Flame, Sparkles };

export function CategoriesSection({ items = categories }: { items?: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">Categorías</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-brand-deep sm:text-4xl">Explorá por categorías</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Encontrá rápido lo que necesitás entre nuestras secciones más buscadas.
          </p>
        </div>
        <Link to="/catalogo" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-royal hover:gap-2 transition-all">
          Ver todo <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((c, i) => {
          const Icon = iconMap[c.icon as keyof typeof iconMap] ?? Sparkles;
          return (
            <Link
              key={c.slug}
              to="/catalogo"
              search={{ categoria: c.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-soft to-white p-5 card-hover"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-royal/10 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-royal text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-brand-deep">
                  {c.count}+
                </span>
              </div>
              <h3 className="relative mt-6 font-display text-lg font-bold text-brand-deep">{c.name}</h3>
              <p className="relative mt-1 text-xs text-muted-foreground">Productos seleccionados</p>
              <div className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-royal opacity-0 transition-opacity group-hover:opacity-100">
                Ver categoría <ArrowUpRight className="h-3 w-3" />
              </div>
              <span className="sr-only">posición {i + 1}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

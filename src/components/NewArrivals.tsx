import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";

export function NewArrivals({ items }: { items?: Product[] }) {
  const displayItems = items ?? products.filter((p) => p.badge === "Nuevo").concat(products.slice(-2)).slice(0, 4);
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px gold-hairline opacity-40 lg:inset-x-8" />
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-royal/15 bg-brand-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">
            <Sparkles className="h-3.5 w-3.5" /> Recién llegados
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-deep sm:text-4xl lg:text-5xl">
            Nuevos <span className="text-gradient-royal">ingresos</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Productos recién llegados — siempre algo nuevo para descubrir.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {displayItems.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/catalogo"
          className="group inline-flex items-center gap-2 rounded-full border border-brand-royal/20 bg-white px-7 py-3.5 font-bold text-brand-deep shadow-sm transition hover:-translate-y-0.5 hover:gap-3 hover:border-brand-royal/40 hover:bg-brand-soft hover:shadow-md"
        >
          Explorar catálogo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";

export function NewArrivals({ items }: { items?: Product[] }) {
  const displayItems = items ?? products.filter((p) => p.badge === "Nuevo").concat(products.slice(-2)).slice(0, 4);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-royal">
            <Sparkles className="h-3.5 w-3.5" /> Recién llegados
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand-deep sm:text-4xl">Nuevos ingresos</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">Productos recién llegados para que encuentres siempre algo nuevo.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {displayItems.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="mt-8 text-center">
        <Link to="/catalogo" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 font-semibold text-brand-deep hover:bg-brand-soft transition">
          Explorar catálogo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

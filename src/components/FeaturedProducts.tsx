import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  const items = products.slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">Destacados</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-brand-deep sm:text-4xl">Productos destacados</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">Selección especial de productos con precio, onda y calidad.</p>
        </div>
        <Link to="/catalogo" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-royal hover:gap-2 transition-all">
          Ver todo <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

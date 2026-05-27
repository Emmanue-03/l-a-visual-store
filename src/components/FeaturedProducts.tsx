import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts({ items = products.slice(0, 8) }: { items?: Product[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    // Reduced motion → show immediately
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="soft-section relative overflow-hidden py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-royal/20 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-20 h-32 w-[36rem] -rotate-6 bg-brand-soft blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-16 h-32 w-[34rem] rotate-6 bg-brand-gold-soft/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-royal/15 bg-brand-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">
            <Sparkles className="h-3.5 w-3.5" />
            Destacados
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-deep sm:text-4xl lg:text-5xl">
            <span className="accent-underline">Productos</span>{" "}
            <span className="text-gradient-royal">destacados</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Una seleccion curada con precio, calidad y atencion cercana. Las cards entran suave al hacer scroll.
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

        <div
          ref={gridRef}
          className={`reveal-grid grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 ${visible ? "is-visible" : ""}`}
        >
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

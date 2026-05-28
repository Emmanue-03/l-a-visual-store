import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";
import { SectionHead } from "./SectionHead";

export function FeaturedProducts({ items = products.slice(0, 8) }: { items?: Product[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
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
    <section className="relative overflow-hidden bg-[var(--paper-2)] py-14 lg:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-royal/20 to-transparent" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-7">
        <SectionHead
          kicker="Destacados"
          title={
            <>
              Una selección curada para <span className="text-brand-gold">comprar con confianza</span>.
            </>
          }
          description="Precio, calidad y atención cercana. Productos elegidos por nuestro equipo."
          ctaLabel="Ver catálogo completo"
          ctaTo="/catalogo"
        />
        <div
          ref={gridRef}
          className={`reveal-grid mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 ${visible ? "is-visible" : ""}`}
        >
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

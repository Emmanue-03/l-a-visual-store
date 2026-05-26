import { useEffect, useRef, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";

export function BestSellers({ items }: { items?: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const directionRef = useRef(0);
  const scroll = (d: number) => {
    ref.current?.scrollBy({ left: d * 320, behavior: "smooth" });
  };
  const stopEdgeScroll = () => {
    directionRef.current = 0;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };
  const startEdgeScroll = (direction: number) => {
    directionRef.current = direction;
    if (frameRef.current !== null) return;

    const tick = () => {
      if (!ref.current || directionRef.current === 0) {
        frameRef.current = null;
        return;
      }

      ref.current.scrollBy({ left: directionRef.current * 9 });
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  };
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const edgeSize = Math.min(120, el.clientWidth * 0.18);
    const { left, right } = el.getBoundingClientRect();
    const canScrollLeft = el.scrollLeft > 0;
    const canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;

    if (event.clientX - left < edgeSize && canScrollLeft) {
      startEdgeScroll(-1);
      return;
    }

    if (right - event.clientX < edgeSize && canScrollRight) {
      startEdgeScroll(1);
      return;
    }

    stopEdgeScroll();
  };

  useEffect(() => stopEdgeScroll, []);

  const displayItems = items ?? products.filter((p) => p.badge === "Top venta" || p.rating >= 4.7);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-royal">
            <TrendingUp className="h-3.5 w-3.5" /> Más elegidos
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand-deep sm:text-4xl">Lo más elegido por nuestros clientes</h2>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white hover:bg-brand-soft transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Siguiente" className="grid h-10 w-10 place-items-center rounded-full bg-brand-royal text-white hover:opacity-90 transition">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={stopEdgeScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {displayItems.map((p) => (
          <div key={p.id} className="w-[260px] flex-none snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

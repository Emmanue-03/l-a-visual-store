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
    <section className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-brand-royal/15 to-transparent lg:inset-x-8" />
      <div className="mb-10 flex items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-royal/15 bg-brand-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">
            <TrendingUp className="h-3.5 w-3.5" /> Más elegidos
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-deep sm:text-4xl lg:text-5xl">
            Lo más elegido por <span className="text-gradient-royal">nuestros clientes</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Lo que vuela de las góndolas — bestsellers verificados.
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-royal/15 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-royal/40 hover:bg-brand-soft hover:shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Siguiente"
            className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-royal to-brand-deep text-white shadow-md shadow-brand-royal/30 transition hover:-translate-y-0.5 hover:shadow-lg btn-glow"
          >
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

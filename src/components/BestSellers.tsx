import { useEffect, useRef, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";
import { SectionHead } from "./SectionHead";

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
    if (event.clientX - left < edgeSize && canScrollLeft) { startEdgeScroll(-1); return; }
    if (right - event.clientX < edgeSize && canScrollRight) { startEdgeScroll(1); return; }
    stopEdgeScroll();
  };

  useEffect(() => stopEdgeScroll, []);

  const displayItems = items ?? products.filter((p) => p.badge === "Top venta" || p.rating >= 4.7);

  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-14 sm:px-7 lg:py-20">
      <SectionHead
        kicker="Más vendidos"
        title={
          <>
            Lo que <span className="text-brand-gold">más eligen</span> nuestros clientes.
          </>
        }
        description="Productos verificados, con stock listo para envío y reseñas reales de quienes ya los compraron."
        ctaLabel="Ver todos los más vendidos"
        ctaTo="/catalogo"
      />

      <div className="relative mt-8">
        <div className="absolute -right-1 -top-16 hidden gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-soft bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-royal hover:bg-brand-soft"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Siguiente"
            className="grid h-11 w-11 place-items-center rounded-full bg-brand-deep text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-royal"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
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
      </div>
    </section>
  );
}

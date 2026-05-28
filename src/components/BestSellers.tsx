import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";
import { SectionHead } from "./SectionHead";

export function BestSellers({ items }: { items?: Product[] }) {
  const displayItems =
    items ?? products.filter((p) => p.badge === "Top venta" || p.rating >= 4.7);

  // Para que el loop visual no quede vacío con pocos items, repetimos la lista
  // hasta llegar a ~6 cards. Estas repeticiones son interactivas igual: cada
  // ProductCard tiene su propio state local y add() del cart deduplica por id.
  const MIN_FOR_LOOP = 6;
  const padded =
    displayItems.length === 0
      ? []
      : Array.from({
          length: Math.max(1, Math.ceil(MIN_FOR_LOOP / displayItems.length)),
        }).flatMap(() => displayItems);

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

      {displayItems.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-brand-soft bg-white p-10 text-center text-brand-muted">
          Aún no hay productos destacados.
        </div>
      ) : (
        <div
          className="la-marquee group relative mt-8"
          aria-label="Carrusel de productos destacados"
        >
          {/* fades laterales para suavizar el loop */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-[var(--paper,#FBFAF7)] to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-[var(--paper,#FBFAF7)] to-transparent sm:block" />

          <div className="la-marquee-track flex gap-4 pb-4">
            {padded.map((p, i) => (
              <div key={`og-${p.id}-${i}`} className="w-[260px] flex-none">
                <ProductCard product={p} />
              </div>
            ))}
            {/* Duplicado visual para loop infinito; aria-hidden para no
                duplicar lectura por screen readers. La interactividad del
                ProductCard sigue funcionando (add al cart deduplica por id). */}
            {padded.map((p, i) => (
              <div
                key={`dup-${p.id}-${i}`}
                aria-hidden="true"
                className="w-[260px] flex-none"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

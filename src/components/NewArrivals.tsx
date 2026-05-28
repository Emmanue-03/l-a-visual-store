import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";
import { SectionHead } from "./SectionHead";

export function NewArrivals({ items }: { items?: Product[] }) {
  const displayItems =
    items ??
    products
      .filter((p) => p.badge === "Nuevo")
      .concat(products.slice(-2))
      .slice(0, 4);

  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-14 sm:px-7 lg:py-20">
      <SectionHead
        kicker="Nuevos ingresos"
        title={
          <>
            Recién llegados a <span className="text-brand-gold">L&amp;A</span>.
          </>
        }
        description="Productos que estrenamos esta semana. Los primeros en llevarlos siempre se llevan los mejores precios."
        ctaLabel="Ver todos los nuevos"
        ctaTo="/catalogo"
        ctaSearch={{ tag: "nuevos" }}
      />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {displayItems.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

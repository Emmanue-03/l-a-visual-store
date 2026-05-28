import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { BestSellers } from "@/components/BestSellers";
import { NewArrivals } from "@/components/NewArrivals";
import { DealsSection } from "@/components/DealsSection";
import { BrandsStrip } from "@/components/BrandsStrip";
import { BenefitsSection } from "@/components/BenefitsSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { getCatalog } from "@/backend/catalog";

export const Route = createFileRoute("/")({
  loader: () => getCatalog(),
  component: Index,
});

function Index() {
  const { products, categories } = Route.useLoaderData();

  const bestSellers = products
    .filter((p) => p.isBestSeller || p.badge === "Top venta" || p.rating >= 4.7)
    .slice(0, 12);
  const newArrivals = products
    .filter((p) => p.isNewArrival || p.badge === "Nuevo")
    .concat(products.slice(-4))
    .slice(0, 4);
  // Hot Sale banner = productos con descuento real (oldPrice) o marcados
  // como Oferta desde el admin (badge="Oferta").
  const deals = products
    .filter((p) => p.oldPrice || p.badge === "Oferta")
    .slice(0, 4);

  return (
    <>
      <Hero />
      <BestSellers items={bestSellers.length ? bestSellers : products.slice(0, 8)} />
      <NewArrivals items={newArrivals.length ? newArrivals : products.slice(0, 4)} />
      <DealsSection items={deals} />
      <BrandsStrip />
      <BenefitsSection />
      <CategoriesSection items={categories} />
    </>
  );
}

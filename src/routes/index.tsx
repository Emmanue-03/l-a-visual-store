import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { DealsSection } from "@/components/DealsSection";
import { BestSellers } from "@/components/BestSellers";
import { NewArrivals } from "@/components/NewArrivals";
import { BenefitsSection } from "@/components/BenefitsSection";
import { BrandsStrip } from "@/components/BrandsStrip";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA } from "@/components/FinalCTA";
import { getCatalog } from "@/backend/catalog";

export const Route = createFileRoute("/")({
  loader: () => getCatalog(),
  component: Index,
});

function Index() {
  const { products, categories } = Route.useLoaderData();
  const featured = products.filter((product) => product.isFeatured).concat(products).slice(0, 8);
  const deals = products.filter((product) => product.oldPrice).slice(0, 4);
  const bestSellers = products.filter((product) => product.isBestSeller || product.badge === "Top venta" || product.rating >= 4.7);
  const newArrivals = products.filter((product) => product.isNewArrival || product.badge === "Nuevo").concat(products.slice(-2)).slice(0, 4);

  return (
    <>
      <Hero />
      <CategoriesSection items={categories} />
      <FeaturedProducts items={featured} />
      <DealsSection items={deals} />
      <BestSellers items={bestSellers} />
      <NewArrivals items={newArrivals} />
      <BenefitsSection />
      <BrandsStrip />
      <Testimonials />
      <FinalCTA />
    </>
  );
}


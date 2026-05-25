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

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <DealsSection />
      <BestSellers />
      <NewArrivals />
      <BenefitsSection />
      <BrandsStrip />
      <Testimonials />
      <FinalCTA />
    </>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Flame, Sparkles } from "lucide-react";
import { categories as fallbackCategories } from "@/lib/mock-data";
import { resolveCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/lib/catalog-types";
import { SectionHead } from "./SectionHead";

export function CategoriesSection({ items = fallbackCategories }: { items?: Category[] }) {
  // Limitar a categorías reales (sin ofertas/nuevos que ya están en el navstrip).
  const visible = items
    .filter((c) => !["ofertas", "nuevos"].includes(c.slug))
    .slice(0, 11);

  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-14 sm:px-7 lg:py-20">
      <SectionHead
        kicker="Comprar por categoría"
        title={
          <>
            Encontrá lo que buscás <span className="text-brand-gold">en segundos</span>.
          </>
        }
        description="Más de diez rubros curados con productos verificados, marcas conocidas y precios competitivos."
        ctaLabel="Ver todas las categorías"
        ctaTo="/catalogo"
      />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visible.map((c) => {
          const Icon = resolveCategoryIcon(c.icon) ?? Sparkles;
          return (
            <Link
              key={c.slug}
              to="/catalogo"
              search={{ categoria: c.slug }}
              className="group relative flex items-start justify-between gap-3 overflow-hidden rounded-2xl border border-brand-soft bg-white p-5 transition hover:-translate-y-1 hover:border-brand-royal/30 hover:shadow-card"
            >
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-brand-soft bg-[var(--paper-2)] text-brand-deep transition group-hover:border-brand-royal/40 group-hover:bg-brand-soft group-hover:text-brand-royal">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-4 font-display text-[15px] font-bold leading-tight text-brand-deep">
                  {c.name}
                </div>
                <div className="mt-0.5 text-[12px] text-brand-muted">
                  {c.count ? `${c.count} productos` : "Explorar"}
                </div>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-full text-brand-muted transition group-hover:text-brand-royal">
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}

        {/* Card especial: Ofertas hot */}
        <Link
          to="/catalogo"
          search={{ tag: "ofertas" }}
          className="group relative flex items-start justify-between gap-3 overflow-hidden rounded-2xl border border-transparent p-5 text-white transition hover:-translate-y-1 hover:shadow-card"
          style={{ background: "linear-gradient(160deg, #0B1B3F 0%, #1F3DE0 100%)" }}
        >
          <div className="relative">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/20 bg-white/10 text-brand-gold">
              <Flame className="h-5 w-5" />
            </span>
            <div className="mt-4 font-display text-[15px] font-bold leading-tight">
              Ofertas hot
            </div>
            <div className="mt-0.5 text-[12px] text-white/70">Hasta 40% off</div>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-full text-brand-gold-soft">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Grid2x2, Heart, Menu, ShoppingCart, Sparkles, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart-context";
import { categories as fallbackCategories } from "@/lib/mock-data";
import type { Category, Product } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

type NavbarProps = {
  categories?: Category[];
  products?: Product[];
  whatsappPhone?: string;
};

export function Navbar({
  categories = fallbackCategories,
  products: _products = [],
  whatsappPhone: _whatsappPhone,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useRouterState({ select: (s) => s.location.href });
  const { count, open: openCart } = useCart();

  const productCategories = categories.filter(
    (category) => !["ofertas", "nuevos"].includes(category.slug),
  );

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background,border-color,box-shadow] duration-300",
        scrolled
          ? "bg-white/95 border-b border-brand-soft shadow-[0_12px_28px_-22px_rgba(11,27,63,.18)] backdrop-blur"
          : "bg-[rgba(251,250,247,0.78)] border-b border-transparent backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-[84px] max-w-[1240px] items-center justify-between gap-5 px-4 sm:px-7 lg:gap-7">
        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-3 focus-premium">
          <span className="grid h-[46px] w-[46px] place-items-center overflow-hidden rounded-full bg-white shadow-[0_8px_22px_-10px_rgba(31,61,224,0.55)] ring-1 ring-white/40">
            <Logo className="h-full w-full" />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-[18px] font-extrabold tracking-tight text-brand-deep">
              L<span className="mx-0.5 text-brand-gold">&amp;</span>A Multiventas
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.32em] text-brand-muted">
              Tu multitienda
            </span>
          </span>
        </Link>

        {/* Tools */}
        <div className="flex items-center gap-2 lg:gap-2.5">
          <Link
            to="/catalogo"
            aria-label="Favoritos"
            className="hidden h-[46px] w-[46px] place-items-center rounded-2xl border border-brand-soft bg-white text-brand-deep transition hover:-translate-y-0.5 hover:border-brand-royal hover:text-brand-royal hover:shadow-card md:grid"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <button
            onClick={openCart}
            aria-label="Carrito"
            className="relative grid h-[46px] w-[46px] place-items-center rounded-2xl border border-brand-soft bg-white text-brand-deep transition hover:-translate-y-0.5 hover:border-brand-royal hover:text-brand-royal hover:shadow-card"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-[22px] min-w-[22px] place-items-center rounded-full bg-brand-gold px-1.5 text-[11px] font-extrabold text-brand-deep shadow-[0_4px_10px_rgba(212,162,76,.45)]">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Menú"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-brand-soft bg-white text-brand-deep lg:hidden focus-premium"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Nav strip de categorías */}
      <div className="border-t border-brand-soft bg-white/60 backdrop-blur">
        <div className="mx-auto flex h-[52px] max-w-[1240px] items-center gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:px-7 [&::-webkit-scrollbar]:hidden">
          <Link
            to="/catalogo"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-brand-deep px-4 text-[13.5px] font-semibold text-white transition hover:bg-brand-royal"
          >
            <Grid2x2 className="h-[15px] w-[15px]" />
            Todas las categorías
          </Link>
          {productCategories.map((category) => (
            <Link
              key={category.slug}
              to="/catalogo"
              search={{ categoria: category.slug }}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold text-brand-muted transition hover:bg-[var(--paper-2,#F4F2EC)] hover:text-brand-deep"
            >
              {category.name}
            </Link>
          ))}
          <Link
            to="/catalogo"
            search={{ tag: "ofertas" }}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            Ofertas
            <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-rose-700">
              HOT
            </span>
          </Link>
          <Link
            to="/catalogo"
            search={{ tag: "nuevos" }}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-brand-muted transition hover:bg-[var(--paper-2,#F4F2EC)] hover:text-brand-deep"
          >
            Nuevos
            <Sparkles className="h-[13px] w-[13px] text-brand-gold" />
          </Link>
        </div>
      </div>

      {/* Menú mobile */}
      {open && (
        <div className="border-t border-brand-soft bg-white shadow-xl animate-fade-up lg:hidden">
          <div className="mx-auto max-w-[1240px] space-y-2 px-4 py-3">
            <Link
              to="/"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-deep hover:bg-brand-soft"
            >
              Inicio
            </Link>
            <div className="rounded-xl border border-brand-soft bg-white p-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">
                Categorías
              </div>
              <div className="mt-1 grid gap-0.5">
                {productCategories.map((category) => (
                  <Link
                    key={category.slug}
                    to="/catalogo"
                    search={{ categoria: category.slug }}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-deep hover:bg-brand-soft"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/contacto"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-deep hover:bg-brand-soft"
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

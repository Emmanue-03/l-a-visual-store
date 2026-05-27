import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, ShoppingCart, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { ProductSearch } from "./ProductSearch";
import { useCart } from "@/lib/cart-context";
import { categories as fallbackCategories, WHATSAPP_PHONE } from "@/lib/mock-data";
import type { Category, Product } from "@/lib/catalog-types";

type NavbarProps = {
  categories?: Category[];
  products?: Product[];
  whatsappPhone?: string;
};

export function Navbar({
  categories = fallbackCategories,
  products = [],
  whatsappPhone = WHATSAPP_PHONE,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { count, open: openCart } = useCart();
  const location = useRouterState({ select: (s) => s.location.href });
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Hola L&A Multiventas")}`;
  const productCategories = categories.filter(
    (category) => !["ofertas", "nuevos"].includes(category.slug)
  );

  useEffect(() => {
    setOpen(false);
    setCategoriesOpen(false);
  }, [location]);

  return (
    <header className="nav-shell sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-3 rounded-full pr-2 focus-premium">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-md shadow-brand-night/10 ring-1 ring-brand-royal/10 transition group-hover:scale-[1.03] group-hover:ring-brand-gold/60">
            <Logo className="h-10 w-10" />
          </span>
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-base font-bold text-brand-deep">L&A</div>
            <div className="text-[10px] font-semibold tracking-[0.28em] text-brand-royal">MULTIVENTAS</div>
          </div>
        </Link>

        <nav className="hidden shrink-0 lg:flex items-center gap-1 ml-4">
          <Link
            to="/"
            className="nav-link-premium rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition hover:bg-white hover:text-brand-royal hover:shadow-sm"
            activeProps={{ className: "text-brand-royal bg-white shadow-sm" }}
            activeOptions={{ exact: true }}
          >
            Inicio
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <Link
              to="/catalogo"
              className="nav-link-premium inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition hover:bg-white hover:text-brand-royal hover:shadow-sm"
              activeProps={{ className: "text-brand-royal bg-white shadow-sm" }}
              onClick={() => setCategoriesOpen(false)}
            >
              Categorías
              <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
            </Link>
            <div
              className={`absolute left-0 top-full z-50 min-w-64 rounded-2xl border border-brand-royal/10 bg-white/95 p-2 shadow-2xl shadow-brand-night/10 backdrop-blur transition-all ${
                categoriesOpen
                  ? "visible translate-y-1 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              {productCategories.map((category) => (
                <Link
                  key={category.slug}
                  to="/catalogo"
                  search={{ categoria: category.slug }}
                  onClick={() => setCategoriesOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground/75 transition hover:bg-brand-soft hover:text-brand-royal"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/contacto"
            className="nav-link-premium rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition hover:bg-white hover:text-brand-royal hover:shadow-sm"
            activeProps={{ className: "text-brand-royal bg-white shadow-sm" }}
          >
            Contacto
          </Link>
        </nav>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
          <ProductSearch
            className="hidden min-w-64 flex-1 md:block lg:max-w-xl xl:max-w-2xl"
            categories={categories}
            products={products}
          />

          <a
            href={whatsappUrl}
            target="_blank" rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/40 focus-premium"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-royal to-brand-night text-white shadow-lg shadow-brand-royal/25 transition hover:-translate-y-0.5 hover:shadow-brand-royal/40 focus-premium"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-gold text-[10px] font-black text-brand-night ring-2 ring-white animate-pulse-glow">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Menú"
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-royal/10 bg-white text-brand-deep shadow-sm transition hover:bg-brand-soft lg:hidden focus-premium"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-brand-royal/10 bg-white/95 shadow-2xl shadow-brand-night/10 backdrop-blur animate-fade-up">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            <ProductSearch
              className="mb-2"
              compact
              categories={categories}
              products={products}
              onPick={() => setOpen(false)}
            />
            <Link
              to="/"
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-brand-soft hover:text-brand-royal"
            >
              Inicio
            </Link>
            <div className="rounded-2xl border border-brand-royal/10 bg-white p-2 shadow-sm">
              <Link
                to="/catalogo"
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-brand-deep hover:bg-brand-soft hover:text-brand-royal"
              >
                Categorías
                <ChevronDown className="h-4 w-4" />
              </Link>
              <div className="mt-1 grid gap-1">
                {productCategories.map((category) => (
                  <Link
                    key={category.slug}
                    to="/catalogo"
                    search={{ categoria: category.slug }}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-5 py-2 text-sm font-medium text-foreground/80 hover:bg-brand-soft hover:text-brand-royal"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/contacto"
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-brand-soft hover:text-brand-royal"
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

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
    <header
      className="sticky top-0 z-50 bg-white shadow-[0_4px_30px_-12px_rgba(8,20,46,0.15)]"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-base font-bold text-brand-deep">L&A</div>
            <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-royal">MULTIVENTAS</div>
          </div>
        </Link>

        <nav className="hidden shrink-0 lg:flex items-center gap-1 ml-4">
          <Link
            to="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:text-brand-royal hover:bg-brand-soft transition"
            activeProps={{ className: "text-brand-royal bg-brand-soft" }}
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
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:text-brand-royal hover:bg-brand-soft transition"
              activeProps={{ className: "text-brand-royal bg-brand-soft" }}
              onClick={() => setCategoriesOpen(false)}
            >
              Categorías
              <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
            </Link>
            <div
              className={`absolute left-0 top-full z-50 min-w-56 rounded-xl border border-border bg-white p-2 shadow-xl transition-all ${
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
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-brand-soft hover:text-brand-royal"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/contacto"
            className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:text-brand-royal hover:bg-brand-soft transition"
            activeProps={{ className: "text-brand-royal bg-brand-soft" }}
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
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 transition"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-royal text-white shadow-md hover:opacity-90 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-brand-royal ring-2 ring-brand-royal animate-pulse-glow">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Menú"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-border animate-fade-up">
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
              className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-brand-soft hover:text-brand-royal"
            >
              Inicio
            </Link>
            <div className="rounded-xl border border-border bg-white/80 p-2">
              <Link
                to="/catalogo"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-brand-deep hover:bg-brand-soft hover:text-brand-royal"
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
                    className="block rounded-lg px-5 py-2 text-sm font-medium text-foreground/80 hover:bg-brand-soft hover:text-brand-royal"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/contacto"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-brand-soft hover:text-brand-royal"
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

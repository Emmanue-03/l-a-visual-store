import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Search, ShoppingCart, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart-context";
import { WHATSAPP_URL } from "@/lib/mock-data";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Categorías" },
  { to: "/catalogo", label: "Ofertas", search: { tag: "ofertas" } },
  { to: "/catalogo", label: "Más vendidos", search: { tag: "top" } },
  { to: "/catalogo", label: "Nuevos ingresos", search: { tag: "nuevos" } },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { count, open: openCart } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [path]);

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

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:text-brand-royal hover:bg-brand-soft transition"
              activeProps={{ className: "text-brand-royal bg-brand-soft" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 shadow-sm w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar productos..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <a
            href={WHATSAPP_URL}
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
            <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 mb-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Buscar..." className="w-full bg-transparent text-sm outline-none" />
            </div>
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-brand-soft hover:text-brand-royal"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

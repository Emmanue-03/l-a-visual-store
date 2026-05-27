import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Instagram, Facebook, Clock } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="brand-ambient relative overflow-hidden text-white/80">
      <div className="absolute inset-x-0 top-0 h-px gold-hairline opacity-80" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
              <Logo className="h-12 w-12" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-base font-bold text-white">L&A</div>
              <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-gold">MULTIVENTAS</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 max-w-xs">
            Tu multitienda de confianza. Tecnología, hogar, accesorios y mucho más, con atención personalizada por WhatsApp.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-white">Navegación</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/", l: "Inicio" },
              { to: "/catalogo", l: "Catálogo" },
              { to: "/catalogo", l: "Ofertas" },
              { to: "/catalogo", l: "Más vendidos" },
              { to: "/contacto", l: "Contacto" },
            ].map((x) => (
              <li key={x.l}><Link to={x.to} className="hover:text-brand-gold transition">{x.l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-white">Categorías</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {["Tecnología", "Hogar", "Electrodomésticos", "Accesorios", "Herramientas"].map((c) => (
              <li key={c}><Link to="/catalogo" className="hover:text-brand-gold transition">{c}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-white">Contacto</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp directo</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-300" /> hola@laymultiventas.com</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-300" /> Asunción, Paraguay</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-300" /> Lun–Sab · 9 a 19 hs</li>
          </ul>
          <div className="mt-5 flex gap-2">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-brand-gold/50 hover:bg-white/10"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-brand-gold/50 hover:bg-white/10"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-5 text-xs text-white/60 flex flex-col sm:flex-row gap-2 justify-between">
          <span>© 2026 L&A MULTIVENTAS. Todos los derechos reservados.</span>
          <span>Diseñado con ♥ para vender más.</span>
        </div>
      </div>
    </footer>
  );
}

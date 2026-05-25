import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/mock-data";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-radial" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full border border-white/10 dots-ring text-white/30 animate-spin-slow" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-brand-royal/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 lg:py-28 text-center text-white">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
          ¿Listo para comprar?
        </div>
        <h2 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
          ¿Listo para encontrar lo que necesitás?
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-white/80">
          Explorá el catálogo de L&A Multiventas o consultanos directo por WhatsApp. Te ayudamos al toque.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand-deep btn-glow hover:bg-blue-50 transition">
            Explorar catálogo <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 font-semibold text-white hover:bg-emerald-600 transition btn-glow">
            <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/mock-data";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="brand-ambient absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-35" />
      <div className="pointer-events-none absolute -left-20 top-16 h-40 w-[38rem] -rotate-6 bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] bottom-10 h-44 w-[38rem] rotate-6 bg-brand-royal/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px gold-hairline opacity-70" />

      <div className="relative mx-auto max-w-5xl px-4 py-24 text-center text-white lg:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
          ¿Listo para comprar?
        </div>
        <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          ¿Listo para encontrar
          <br />
          <span className="text-gradient-white animate-gradient-shift">lo que necesitás?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-white/80 leading-relaxed">
          Explorá el catálogo de L&amp;A Multiventas o consultanos directo por WhatsApp. Te ayudamos al toque.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/catalogo"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 font-bold text-brand-deep btn-glow transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-100 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            Explorar catálogo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/50"
          >
            <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

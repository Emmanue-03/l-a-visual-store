import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Flame, MessageCircle, Sparkles, Truck, Star } from "lucide-react";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section className="brand-ambient relative overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px gold-hairline opacity-80" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
      <div className="pointer-events-none absolute -left-24 top-16 h-44 w-[34rem] -rotate-12 bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-28 h-52 w-[36rem] rotate-12 bg-brand-royal/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-full bg-gradient-to-t from-white via-white/10 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-24">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
            Tu multitienda de confianza
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-[2.45rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Todo lo que buscas,
            <br />
            <span className="text-gradient-white animate-gradient-shift">
              con atencion premium
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Compra facil, rapido y seguro en <span className="font-semibold text-white">L&amp;A Multiventas</span>.
            Tecnologia, hogar, accesorios, ofertas y mucho mas, con asesoramiento directo por WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/catalogo"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 font-bold text-brand-deep shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-blue-50 focus-premium"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Ver catalogo</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/catalogo"
              search={{ tag: "ofertas" }}
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 font-bold text-white shadow-lg shadow-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-gold/60 hover:bg-white/15 focus-premium"
            >
              <Flame className="h-4 w-4 text-brand-gold" />
              Ver ofertas
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
              ))}
              <span className="ml-1 text-sm font-bold">4.9 / 5</span>
            </div>
            <span className="text-xs font-medium text-white/60">atencion rapida y compras verificadas</span>
          </div>

          <div className="mt-9 grid max-w-lg grid-cols-3 gap-2 sm:gap-3">
            {[
              { k: "+1.2k", v: "Clientes" },
              { k: "+500", v: "Productos" },
              { k: "24/7", v: "WhatsApp" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-gold/40 hover:bg-white/15"
              >
                <div className="font-display text-xl font-extrabold sm:text-2xl">{s.k}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[330px] animate-fade-up sm:min-h-[440px] lg:min-h-[560px] [animation-delay:120ms]">
          <div className="hero-product-stage absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] p-5 backdrop-blur sm:h-[330px] sm:w-[330px]">
            <div className="grid h-full w-full place-items-center rounded-[1.5rem] border border-white/20 bg-white/10">
              <Logo className="h-[78%] w-[78%] drop-shadow-2xl" />
            </div>
          </div>

          <div className="absolute left-0 top-4 w-56 rounded-2xl border border-white/20 bg-white/95 p-3.5 text-foreground shadow-xl shadow-black/10 backdrop-blur sm:w-60">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-royal ring-1 ring-brand-royal/10">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-deep">Compra segura</div>
                <div className="text-[11px] text-muted-foreground">Proceso simple</div>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-24 w-56 rounded-2xl border border-white/20 bg-white/95 p-3.5 text-foreground shadow-xl shadow-black/10 backdrop-blur sm:w-60 lg:top-32">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gold-soft text-brand-night ring-1 ring-brand-gold/40">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-deep">Ofertas activas</div>
                <div className="text-[11px] text-muted-foreground">Precios destacados</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 left-2 w-60 rounded-2xl border border-white/20 bg-white/95 p-3.5 text-foreground shadow-xl shadow-black/10 backdrop-blur sm:w-64">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-deep">Atencion WhatsApp</div>
                <div className="text-[11px] text-muted-foreground">Respuesta directa</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-4 w-52 rounded-2xl border border-white/20 bg-white/95 p-3.5 text-foreground shadow-xl shadow-black/10 backdrop-blur sm:w-56">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-brand-royal ring-1 ring-blue-200/70">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-deep">Envios rapidos</div>
                <div className="text-[11px] text-muted-foreground">Coordinados al toque</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

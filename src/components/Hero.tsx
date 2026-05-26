import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Flame, MessageCircle, Sparkles } from "lucide-react";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-radial text-white">
      {/* Decorative orbits */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10 dots-ring text-white/30 animate-spin-slow" />
      <div className="pointer-events-none absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-royal/30 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-56 w-56 rounded-full bg-brand-deep/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-blue-200" />
            Tu multitienda de confianza
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Todo lo que buscás,{" "}
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              en un solo lugar
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
            Comprá fácil, rápido y seguro en L&A Multiventas. Tecnología, hogar, accesorios,
            ofertas y mucho más.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-deep btn-glow hover:bg-blue-50 transition"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/catalogo"
              search={{ tag: "ofertas" }}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/10 transition"
            >
              <Flame className="h-4 w-4 text-orange-300" /> Ver ofertas
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "+1.2k", v: "Clientes felices" },
              { k: "+500", v: "Productos" },
              { k: "24/7", v: "Atención WhatsApp" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur">
                <div className="font-display text-xl font-bold">{s.k}</div>
                <div className="text-[11px] text-white/70">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: visual collage */}
        <div className="relative h-[420px] sm:h-[520px] animate-fade-up [animation-delay:120ms]">
          {/* big circular logo display */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative grid place-items-center">
              <div className="absolute inset-0 -m-12 rounded-full border border-white/10 dots-ring text-white/40 animate-spin-slow" />
              <div className="absolute inset-0 -m-4 rounded-full bg-brand-royal/40 blur-2xl" />
              <div className="relative grid h-56 w-56 sm:h-72 sm:w-72 place-items-center rounded-full bg-gradient-to-br from-white/20 to-white/5 p-4 backdrop-blur ring-1 ring-white/20">
                <Logo className="h-full w-full" />
              </div>
            </div>
          </div>

          {/* floating cards */}
          <div className="absolute left-0 top-6 w-56 rounded-2xl glass p-3 text-foreground shadow-xl animate-float">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Compra segura</div>
                <div className="text-[11px] text-muted-foreground">Datos protegidos</div>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-24 w-56 rounded-2xl glass p-3 text-foreground shadow-xl animate-float-slow">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Ofertas activas</div>
                <div className="text-[11px] text-muted-foreground">Hasta -40% hoy</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-6 w-60 rounded-2xl glass p-3 text-foreground shadow-xl animate-float [animation-delay:1s]">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Atención por WhatsApp</div>
                <div className="text-[11px] text-muted-foreground">Te respondemos al toque</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

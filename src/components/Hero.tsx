import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  CreditCard,
  Flame,
  Headphones,
  Search,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { Logo } from "./Logo";

export function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate({ to: "/catalogo", search: trimmed ? { q: trimmed } : undefined });
  };

  return (
    <section className="relative isolate overflow-hidden text-white">
      {/* Background: navy radial */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(110% 80% at 80% 0%, #2647C9 0%, transparent 55%), radial-gradient(80% 60% at 10% 100%, #1A3A8A 0%, transparent 60%), linear-gradient(180deg, #0B1B3F 0%, #08142E 100%)",
        }}
      />
      {/* Fine grid pattern with mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-55"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 85% 80% at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 80% at 50% 40%, black 30%, transparent 80%)",
        }}
      />
      {/* Gold scanline top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(212,162,76,.7),transparent)]" />
      {/* Glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-40 -z-10 h-[520px] w-[520px] rounded-full blur-2xl la-float-a"
        style={{ background: "radial-gradient(circle, rgba(76,111,255,.45), transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-20 -z-10 h-[420px] w-[420px] rounded-full blur-xl la-float-b"
        style={{ background: "radial-gradient(circle, rgba(212,162,76,.18), transparent 60%)" }}
      />

      <div className="mx-auto max-w-[1240px] px-4 sm:px-7">
        <div className="grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14 lg:py-[88px]">
          {/* Left: copy */}
          <div className="la-anim-up">
            <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur sm:text-[12px] sm:tracking-[0.14em]">
              <span
                className="grid h-[22px] w-[22px] place-items-center rounded-full text-[#1a1106]"
                style={{ background: "linear-gradient(160deg, var(--brand-gold), #8E6A1F)" }}
              >
                <Sparkles className="h-3 w-3" />
              </span>
              <span aria-hidden>🇵🇾</span>
              <span>Stock real</span>
              <span className="text-white/40">·</span>
              <span>Precios para reventa</span>
              <span className="text-white/40">·</span>
              <span>Atención por WhatsApp</span>
            </div>

            {/* Buscador del hero — navega a /catalogo?q=... */}
            <form
              onSubmit={submitSearch}
              role="search"
              className="mt-4 flex h-[54px] w-full max-w-[560px] items-center gap-2 rounded-full border border-brand-soft bg-white pl-5 pr-1.5 shadow-[0_18px_40px_-18px_rgba(11,27,63,.45),0_0_0_1px_rgba(212,162,76,.18)] transition focus-within:border-brand-gold/60 focus-within:shadow-[0_22px_44px_-18px_rgba(11,27,63,.55),0_0_0_4px_rgba(212,162,76,.22)]"
            >
              <Search className="h-[18px] w-[18px] shrink-0 text-brand-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar termos, Hoppies, perfumes, celulares…"
                aria-label="Buscar productos"
                className="min-w-0 flex-1 bg-transparent text-[14.5px] text-brand-deep outline-none placeholder:text-brand-muted sm:text-[15px]"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-full bg-brand-deep px-4 text-[13.5px] font-bold text-white transition hover:bg-brand-royal sm:px-5"
              >
                <span className="hidden sm:inline">Buscar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <h1 className="mt-10 max-w-[18ch] font-display text-[clamp(34px,5vw,60px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-balance">
              Todo para vender,
              <br />
              regalar y{" "}
              <span className="la-shimmer italic font-display font-semibold">
                disfrutar.
              </span>
            </h1>

            <p className="mt-6 max-w-[50ch] text-[16px] leading-[1.6] text-white/75 sm:text-[17px]">
              Celulares, perfumes, termos y <span className="font-semibold text-white">Hoppies personalizables</span>{" "}
              con stock real, precios para reventa y atención rápida por WhatsApp.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/catalogo"
                className="group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full bg-white px-7 font-bold text-[#0B1B3F] shadow-[0_18px_40px_-16px_rgba(255,255,255,.45)] transition hover:-translate-y-0.5"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_30%,rgba(212,162,76,.35)_50%,transparent_70%)] transition-transform duration-700 group-hover:translate-x-[120%]" />
                <span className="relative">Ver catálogo</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/catalogo"
                search={{ tag: "ofertas" }}
                className="group inline-flex h-14 items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.06] px-7 font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-gold/60 hover:bg-white/[0.12]"
              >
                <Flame className="h-4 w-4 text-brand-gold" />
                Ver ofertas activas
              </Link>
            </div>

            {/* Hero strip */}
            <div className="mt-11 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/[0.08] pt-7">
              <Stat k="+1.2k" v="Clientes felices" />
              <Sep />
              <Stat k="+500" v="Productos" />
              <Sep />
              <Stat k="24/7" v="WhatsApp" />
              <Sep />
              <div className="min-w-0">
                <div className="font-display text-[26px] font-bold leading-none">
                  4.9
                  <span className="ml-1 text-[14px] font-medium text-white/55">/ 5</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11.5px] uppercase tracking-[0.14em] text-white/55">
                  <span className="inline-flex items-center gap-0.5 text-brand-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-brand-gold" />
                    ))}
                  </span>
                  Reseñas verificadas
                </div>
              </div>
            </div>
          </div>

          {/* Right: stage with orbits */}
          <div className="relative mx-auto h-[400px] w-full max-w-[520px] lg:mt-2 lg:h-[460px]">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.12] la-rotate"
            >
              <span className="absolute inset-[30px] block rounded-full border border-[rgba(212,162,76,.18)]" />
            </div>

            <Orbit size={340} duration={22} reverse={false}>
              {[0, 72, 144, 216, 288].map((deg) => (
                <Dot key={deg} deg={deg} radius={170} variant={deg === 0 ? "lg" : deg === 144 ? "sm" : "md"} />
              ))}
            </Orbit>
            <Orbit size={400} duration={34} reverse>
              {[30, 110, 200, 270].map((deg) => (
                <Dot key={deg} deg={deg} radius={200} variant={deg === 200 ? "lg" : deg === 30 ? "sm" : "md"} />
              ))}
            </Orbit>
            <Orbit size={470} duration={50} reverse={false}>
              {[15, 95, 170, 255, 325].map((deg) => (
                <Dot key={deg} deg={deg} radius={235} variant={deg === 95 || deg === 170 ? "sm" : "md"} />
              ))}
            </Orbit>

            {/* Logo disc */}
            <div
              className="absolute left-1/2 top-1/2 grid h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/[0.05] p-4 shadow-[0_30px_60px_-20px_rgba(31,61,224,.55)] backdrop-blur sm:h-[280px] sm:w-[280px]"
              style={{ boxShadow: "0 30px 80px -28px rgba(31,61,224,.55), 0 0 0 1px rgba(255,255,255,.12) inset" }}
            >
              <div
                className="absolute inset-3 rounded-full"
                style={{ background: "radial-gradient(closest-side, rgba(255,255,255,.18), transparent)" }}
              />
              <Logo className="relative h-[80%] w-[80%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Trustbar */}
      <div className="border-t border-white/[0.08] bg-[#08142E]/60 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-9 gap-y-3 px-4 py-4 text-[12.5px] font-semibold text-white/75 sm:px-7 sm:py-5">
          <Badge icon={<BadgeCheck className="h-4 w-4 text-brand-gold" />} text="Mercado Pago verificado" />
          <Badge icon={<Truck className="h-4 w-4 text-brand-gold" />} text="Envíos a todo el país" />
          <Badge icon={<Clock className="h-4 w-4 text-brand-gold" />} text="Entrega 24/48 hs" />
          <Badge icon={<CreditCard className="h-4 w-4 text-brand-gold" />} text="Hasta 12 cuotas sin interés" />
          <Badge icon={<Headphones className="h-4 w-4 text-brand-gold" />} text="Atención personal" />
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-display text-[26px] font-bold leading-none">{k}</div>
      <div className="mt-1 text-[11.5px] uppercase tracking-[0.14em] text-white/55">{v}</div>
    </div>
  );
}

function Sep() {
  return <div aria-hidden className="hidden h-12 w-px self-stretch bg-white/[0.08] sm:block" />;
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {icon}
      {text}
    </span>
  );
}

function Orbit({
  size,
  duration,
  reverse,
  children,
}: {
  size: number;
  duration: number;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full la-orbit"
      style={{
        width: size,
        height: size,
        animationDuration: `${duration}s`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {children}
    </div>
  );
}

function Dot({
  deg,
  radius,
  variant,
}: {
  deg: number;
  radius: number;
  variant: "sm" | "md" | "lg";
}) {
  const sz = variant === "sm" ? 4 : variant === "lg" ? 8 : 6;
  return (
    <span
      className="absolute left-1/2 top-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,.55),0_0_14px_rgba(140,170,255,.35)]"
      style={{
        width: sz,
        height: sz,
        marginLeft: -sz / 2,
        marginTop: -sz / 2,
        transform: `rotate(${deg}deg) translateY(${radius}px)`,
        opacity: variant === "lg" ? 0.7 : variant === "sm" ? 0.4 : 0.55,
      }}
    />
  );
}

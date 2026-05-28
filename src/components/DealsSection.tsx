import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Flame, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/catalog-types";
import { formatPrice, WHATSAPP_PHONE } from "@/lib/mock-data";

const productRouteId = (product: Product) =>
  product.slug ??
  product.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

const target = Date.now() + 1000 * 60 * 60 * 24 * 3;

export function DealsSection({ items = [] }: { items?: Product[] }) {
  const top = items.slice(0, 2);
  const { d, h, m, s } = useCountdown(target);
  const wa = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Hola L&A, quiero consultar por las ofertas del Hot Sale",
  )}`;

  const topDiscount =
    top
      .map((p) => (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0))
      .reduce((a, b) => Math.max(a, b), 0) || 40;

  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-10 sm:px-7 lg:py-14">
      <div
        className="relative overflow-hidden rounded-[28px] border border-white/10 p-7 sm:p-10 lg:p-12"
        style={{ background: "linear-gradient(120deg, #0B1B3F 0%, #1F3DE0 60%, #2A56FF 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 70% 70% at 70% 30%, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 70% 30%, black 20%, transparent 80%)",
          }}
        />
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_10px_var(--brand-gold)]" />
              Hot Sale L&amp;A
            </span>
            <h3 className="mt-4 font-display text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.08] tracking-[-0.025em]">
              Hasta {topDiscount}% off en{" "}
              <span className="italic font-display font-semibold text-brand-gold-soft">
                productos seleccionados
              </span>
              .
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-white/75">
              Promo válida hasta agotar stock. Coordinamos el envío por WhatsApp en minutos.
              Hasta 12 cuotas sin interés con tarjetas seleccionadas.
            </p>

            <div className="mt-6 grid grid-cols-4 gap-2 sm:max-w-md sm:gap-3">
              {[
                { n: d, u: "Días" },
                { n: h, u: "Horas" },
                { n: m, u: "Min" },
                { n: s, u: "Seg" },
              ].map(({ n, u }) => (
                <div
                  key={u}
                  className="rounded-2xl border border-white/15 bg-white/[0.08] px-2 py-3 text-center backdrop-blur"
                >
                  <div className="font-mono text-[26px] font-extrabold leading-none tabular-nums text-white">
                    {String(n).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/55">{u}</div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                search={{ tag: "ofertas" }}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-[#0B1B3F] shadow-md transition hover:-translate-y-0.5"
              >
                <Flame className="h-4 w-4 text-brand-gold" />
                Ver ofertas
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-6 font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-gold/60 hover:bg-white/[0.12]"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>

          <div className="relative h-[320px] sm:h-[360px]">
            <div
              className="absolute right-2 top-2 z-10 grid h-24 w-24 place-items-center rounded-full border-4 border-white/30 text-center text-[#0B1B3F] sm:right-6 sm:top-0 sm:h-28 sm:w-28"
              style={{ background: "radial-gradient(circle, #F1D89A 0%, #D4A24C 80%)" }}
            >
              <div>
                <div className="font-display text-[24px] font-extrabold leading-none">{topDiscount}%</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em]">OFF</div>
              </div>
            </div>

            {top[0] && <Tile product={top[0]} className="absolute left-0 top-12 w-[68%] -rotate-3" />}
            {top[1] && <Tile product={top[1]} className="absolute right-0 bottom-0 w-[64%] rotate-3" />}
            {!top.length && (
              <div className="absolute inset-0 grid place-items-center rounded-3xl border border-dashed border-white/20 text-sm text-white/60">
                Sin ofertas activas
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({ product, className }: { product: Product; className?: string }) {
  return (
    <Link
      to="/producto/$id"
      params={{ id: productRouteId(product) }}
      className={`overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl transition hover:-translate-y-1 hover:rotate-0 ${className ?? ""}`}
    >
      <div className="aspect-[4/3] bg-brand-soft">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="px-3 py-3">
        <div className="line-clamp-1 text-[13px] font-bold text-brand-deep">{product.name}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-[16px] font-extrabold text-brand-royal">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[11px] text-brand-muted line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

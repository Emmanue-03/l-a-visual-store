import { Link } from "@tanstack/react-router";
import { Flame, ArrowRight } from "lucide-react";
import { products, formatPrice } from "@/lib/mock-data";
import type { Product } from "@/lib/catalog-types";
import { useCart } from "@/lib/cart-context";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Countdown() {
  const [t, setT] = useState({ h: 5, m: 42, s: 18 });
  useEffect(() => {
    const i = setInterval(() => {
      setT((p) => {
        let { h, m, s } = p;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);
  const cell = (n: number, l: string) => (
    <div className="flex min-w-16 flex-col items-center rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur shadow-lg shadow-black/10">
      <span className="font-display text-2xl font-extrabold tabular-nums">{String(n).padStart(2, "0")}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{l}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2">
      {cell(t.h, "hrs")}
      <span className="text-white/40">:</span>
      {cell(t.m, "min")}
      <span className="text-white/40">:</span>
      {cell(t.s, "seg")}
    </div>
  );
}

export function DealsSection({ items }: { items?: Product[] }) {
  const { add } = useCart();
  const deals = items ?? products.filter((p) => p.oldPrice).slice(0, 4);
  const addDeal = (product: Product) => {
    add(product);
    toast.success("Producto agregado al carrito", {
      description: `1 x ${product.name}`,
    });
  };

  return (
    <section className="brand-ambient relative overflow-hidden py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-35" />
      <div className="pointer-events-none absolute -left-16 top-12 h-40 w-[42rem] -rotate-6 bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-8 h-44 w-[40rem] rotate-6 bg-brand-royal/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
              <Flame className="h-3.5 w-3.5 text-brand-gold" /> Tiempo limitado
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Ofertas que <span className="text-gradient-white">vuelan</span>
            </h2>
            <p className="mt-3 max-w-xl text-white/70">
              Promos seleccionadas por tiempo limitado. Aprovechá antes de que se agoten.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Termina en</span>
            <Countdown />
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((p) => {
            const off = Math.round(((p.oldPrice! - p.price) / p.oldPrice!) * 100);
            return (
              <div key={p.id} className="premium-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur card-hover hover:border-brand-gold/50">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute left-2 top-2 rounded-full bg-brand-gold px-3 py-1 text-xs font-black text-brand-night shadow-lg ring-1 ring-white/30">
                    -{off}%
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 font-display font-semibold leading-snug">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-xl font-extrabold">{formatPrice(p.price)}</span>
                  <span className="text-xs text-white/60 line-through">{formatPrice(p.oldPrice!)}</span>
                </div>
                <button
                  onClick={() => addDeal(p)}
                  className="group/btn relative mt-3 inline-flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-brand-deep shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-200/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                  Aprovechar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/catalogo"
            search={{ tag: "ofertas" }}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand-deep btn-glow transition hover:gap-3 hover:bg-blue-50"
          >
            Ver todas las ofertas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

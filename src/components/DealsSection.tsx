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
    <div className="flex flex-col items-center rounded-xl bg-white/10 px-3 py-2 backdrop-blur min-w-14">
      <span className="font-display text-2xl font-bold">{String(n).padStart(2, "0")}</span>
      <span className="text-[10px] uppercase tracking-wider text-white/60">{l}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2">
      {cell(t.h, "hrs")}{cell(t.m, "min")}{cell(t.s, "seg")}
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
    <section className="relative overflow-hidden bg-brand-radial py-16 lg:py-24 text-white">
      <div className="pointer-events-none absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-brand-royal/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-brand-deep/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Flame className="h-3.5 w-3.5 text-orange-300" /> Tiempo limitado
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Ofertas que vuelan</h2>
            <p className="mt-2 max-w-xl text-white/70">
              Promos seleccionadas por tiempo limitado. Aprovechá antes de que se agoten.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-xs text-white/60">Termina en</span>
            <Countdown />
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((p) => {
            const off = Math.round(((p.oldPrice! - p.price) / p.oldPrice!) * 100);
            return (
              <div key={p.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur card-hover">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute left-2 top-2 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-white">
                    -{off}%
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 font-display font-semibold">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-lg font-bold">{formatPrice(p.price)}</span>
                  <span className="text-xs text-white/60 line-through">{formatPrice(p.oldPrice!)}</span>
                </div>
                <button
                  onClick={() => addDeal(p)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-brand-deep transition hover:bg-blue-50"
                >
                  Aprovechar <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to="/catalogo" search={{ tag: "ofertas" }} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-deep btn-glow hover:bg-blue-50">
            Ver todas las ofertas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

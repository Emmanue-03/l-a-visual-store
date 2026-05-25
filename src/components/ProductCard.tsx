import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, ShoppingCart, Eye, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/mock-data";
import { formatPrice } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const addToCart = () => {
    add(product, qty);
    toast.success("Producto agregado al carrito", {
      description: `${qty} x ${product.name}`,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-hover">
      <Link to="/producto/$id" params={{ id: product.id }} className="relative block aspect-square overflow-hidden bg-brand-soft">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md
            ${product.badge === "Oferta" ? "bg-destructive" : product.badge === "Nuevo" ? "bg-brand-royal" : "bg-brand-deep"}`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-brand-royal shadow">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-current" : "opacity-30"}`} />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <Link to="/producto/$id" params={{ id: product.id }} className="line-clamp-2 font-display font-semibold text-foreground hover:text-brand-royal transition-colors">
          {product.name}
        </Link>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-royal">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-border bg-white p-1">
          <button
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            aria-label="Restar cantidad"
            className="grid h-8 w-8 place-items-center rounded-lg text-brand-deep hover:bg-brand-soft"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-8 text-center text-sm font-bold text-brand-deep">{qty}</span>
          <button
            onClick={() => setQty((value) => Math.min(product.stock, value + 1))}
            aria-label="Sumar cantidad"
            className="grid h-8 w-8 place-items-center rounded-lg text-brand-deep hover:bg-brand-soft"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={addToCart}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-royal px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 btn-glow"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </button>
          <Link
            to="/producto/$id"
            params={{ id: product.id }}
            aria-label="Ver detalle"
            className="grid place-items-center rounded-xl border border-border px-3 text-brand-deep hover:bg-brand-soft transition"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

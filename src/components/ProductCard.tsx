import { Link } from "@tanstack/react-router";
import { type CSSProperties, useState } from "react";
import { ShoppingCart, Eye, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/catalog-types";
import { formatPrice } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";

const productRouteId = (product: Product) =>
  product.slug ??
  product.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  // Stock real: solo lo respetamos como tope si es un número > 0. Si viene
  // 0/undefined/null no significa "no podes agregar" — significa que no
  // estamos trackeando inventario para esta card. El badge "Sin stock"
  // se decide aparte (hasStockField + stock === 0).
  const stockNumber = typeof product.stock === "number" ? product.stock : null;
  const hasStockLimit = stockNumber !== null && stockNumber > 0;
  const isOutOfStock = stockNumber === 0;

  const gallery = product.gallery?.length
    ? product.gallery
    : [
        product.image,
        product.image.replace("fit=crop", "fit=crop&crop=entropy"),
        product.image.replace("w=800&h=800", "w=900&h=900"),
      ];
  const hasGallery = gallery.length > 1;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const decrease = () => setQty((value) => Math.max(1, value - 1));
  const increase = () =>
    setQty((value) => (hasStockLimit ? Math.min(stockNumber!, value + 1) : value + 1));

  const addToCart = () => {
    if (isOutOfStock) {
      toast.error("Producto sin stock disponible");
      return;
    }
    const safeQty = Math.max(1, qty);
    add(product, safeQty);
    toast.success("Producto agregado al carrito", {
      description: `${safeQty} x ${product.name}`,
    });
    setQty(1);
  };

  return (
    <div className="premium-card product-card-premium group relative flex flex-col overflow-hidden rounded-2xl border border-brand-royal/10 bg-white card-hover hover:border-brand-royal/25">
      <Link
        to="/producto/$id"
        params={{ id: productRouteId(product) }}
        className="product-gallery-scene relative block aspect-square overflow-hidden bg-gradient-to-br from-white via-brand-soft/70 to-white"
      >
        <div className="absolute inset-x-0 top-0 z-10 h-px gold-hairline opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <img
          src={gallery[0]}
          alt={product.name}
          loading="lazy"
          className="product-gallery-image h-full w-full object-cover"
        />
        {gallery.slice(1).map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            loading="lazy"
            aria-hidden="true"
            style={{
              "--gallery-duration": `${gallery.length * 0.85}s`,
              "--gallery-delay": `${(index + 1) * 0.85}s`,
            } as CSSProperties}
            className="product-gallery-image product-gallery-alt absolute inset-0 h-full w-full object-cover"
          />
        ))}
        {hasGallery && (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full border border-white/60 bg-white/80 px-2 py-1 shadow-sm backdrop-blur">
            {gallery.map((image, index) => (
              <span
                key={image}
                className={`h-1.5 rounded-full ${index === 0 ? "w-4 bg-brand-royal" : "w-1.5 bg-brand-muted/40"}`}
              />
            ))}
          </div>
        )}
        {product.badge && (
          <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-lg ring-1 ring-white/40
            ${product.badge === "Oferta" ? "bg-brand-gold text-brand-night" : product.badge === "Nuevo" ? "bg-brand-royal text-white" : "bg-brand-deep text-white"}`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-brand-royal shadow-md ring-1 ring-brand-gold/40 backdrop-blur">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-royal">
            {product.category}
          </span>
          <span className={`text-[10px] font-semibold ${isOutOfStock ? "text-rose-600" : "text-muted-foreground"}`}>
            {isOutOfStock ? "Sin stock" : hasStockLimit ? `Stock ${stockNumber}` : "Disponible"}
          </span>
        </div>
        <Link to="/producto/$id" params={{ id: productRouteId(product) }} className="line-clamp-2 min-h-[2.75rem] font-display font-bold leading-snug text-brand-deep transition-colors hover:text-brand-royal">
          {product.name}
        </Link>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-display text-xl font-extrabold text-brand-royal">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-brand-royal/10 bg-brand-soft/60 p-1">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); decrease(); }}
            disabled={qty <= 1 || isOutOfStock}
            aria-label="Restar cantidad"
            className="grid h-8 w-8 place-items-center rounded-lg text-brand-deep transition hover:bg-white hover:text-brand-royal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-8 text-center text-sm font-bold text-brand-deep tabular-nums">{qty}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); increase(); }}
            disabled={isOutOfStock || (hasStockLimit && qty >= stockNumber!)}
            aria-label="Sumar cantidad"
            className="grid h-8 w-8 place-items-center rounded-lg text-brand-deep transition hover:bg-white hover:text-brand-royal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); addToCart(); }}
            disabled={isOutOfStock}
            className="group/btn relative flex flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-br from-brand-royal to-brand-deep px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg btn-glow disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? "Sin stock" : "Agregar"}
          </button>
          <Link
            to="/producto/$id"
            params={{ id: productRouteId(product) }}
            aria-label="Ver detalle"
            className="grid place-items-center rounded-xl border border-border bg-white px-3 text-brand-deep transition hover:border-brand-royal/40 hover:bg-brand-soft hover:text-brand-royal"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

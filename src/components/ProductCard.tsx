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

  const addToCart = () => {
    add(product, qty);
    toast.success("Producto agregado al carrito", {
      description: `${qty} x ${product.name}`,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-hover">
      <Link
        to="/producto/$id"
        params={{ id: productRouteId(product) }}
        className="product-gallery-scene relative block aspect-square overflow-hidden bg-brand-soft"
      >
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
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/75 px-2 py-1 shadow-sm backdrop-blur">
            {gallery.map((image, index) => (
              <span
                key={image}
                className={`h-1.5 rounded-full ${index === 0 ? "w-4 bg-brand-royal" : "w-1.5 bg-brand-muted/40"}`}
              />
            ))}
          </div>
        )}
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
        <Link to="/producto/$id" params={{ id: productRouteId(product) }} className="line-clamp-2 font-display font-semibold text-foreground hover:text-brand-royal transition-colors">
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
            params={{ id: productRouteId(product) }}
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

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, ShoppingCart, MessageCircle, ShieldCheck, Truck, Headphones, Minus, Plus, ChevronRight } from "lucide-react";
import { products, formatPrice, WHATSAPP_URL } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/producto/$id")({
  component: ProductDetail,
  loader: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} | L&A Multiventas` },
      { name: "description", content: loaderData.product.description },
      { property: "og:image", content: loaderData.product.image },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-brand-deep">Producto no encontrado</h1>
      <Link to="/catalogo" className="mt-5 inline-block rounded-full bg-brand-royal px-5 py-2.5 text-sm font-semibold text-white">Volver al catálogo</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10">Error: {error.message}</div>,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const gallery = product.gallery ?? [product.image, product.image, product.image];
  const [active, setActive] = useState(0);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-brand-royal">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/catalogo" className="hover:text-brand-royal">Catálogo</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-deep font-semibold truncate">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-brand-soft aspect-square">
            <img src={gallery[active]} alt={product.name} className="h-full w-full object-cover" />
            {product.badge && (
              <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md
                ${product.badge === "Oferta" ? "bg-destructive" : product.badge === "Nuevo" ? "bg-brand-royal" : "bg-brand-deep"}`}>
                {product.badge}
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {gallery.map((g: string, i: number) => (
              <button key={i} onClick={() => setActive(i)} className={`aspect-square overflow-hidden rounded-xl border-2 transition ${active === i ? "border-brand-royal" : "border-transparent"}`}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-brand-soft px-3 py-1 font-semibold uppercase tracking-wider text-brand-royal">{product.category}</span>
            <span className="text-emerald-600 font-semibold">● Stock disponible ({product.stock})</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-brand-deep sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-current" : "opacity-30"}`} />)}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} · {product.reviews} reseñas</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-brand-royal">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">-{discount}%</span>
              </>
            )}
          </div>

          <p className="mt-5 text-foreground/80">{product.description}</p>

          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
            {product.features.map((f: string) => (
              <li key={f} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-royal" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center text-brand-deep hover:bg-brand-soft rounded-l-full"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center text-brand-deep hover:bg-brand-soft rounded-r-full"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={() => add(product, qty)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-royal px-5 py-3 font-semibold text-white btn-glow hover:opacity-90">
              <ShoppingCart className="h-4 w-4" /> Agregar al carrito
            </button>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600">
            <MessageCircle className="h-4 w-4" /> Comprar por WhatsApp
          </a>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { i: Headphones, t: "Atención personalizada" },
              { i: ShieldCheck, t: "Compra segura" },
              { i: Truck, t: "Envíos disponibles" },
            ].map((b) => (
              <div key={b.t} className="rounded-xl border border-border bg-card p-3 text-center">
                <b.i className="mx-auto h-5 w-5 text-brand-royal" />
                <div className="mt-1 text-[11px] font-semibold text-brand-deep">{b.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-brand-deep">Productos relacionados</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

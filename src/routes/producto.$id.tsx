import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, ShieldCheck, Truck, Headphones, Minus, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/ProductCard";
import { getCatalog } from "@/backend/catalog";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const Route = createFileRoute("/producto/$id")({
  component: ProductDetail,
  loader: async ({ params }) => {
    const catalog = await getCatalog();
    const p = catalog.products.find((x) => x.slug === params.id || x.id === params.id || slugify(x.name) === params.id);
    if (!p) throw notFound();
    const norm = (value?: string | null) => (value ?? "").trim().toLowerCase();
    const baseKey = norm(p.category);
    const related = catalog.products
      .filter((product) => norm(product.category) === baseKey && product.id !== p.id)
      .slice(0, 4);
    return { product: p, related };
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
  const { product, related } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const gallery = product.gallery ?? [product.image, product.image, product.image];
  const [active, setActive] = useState(0);
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const addToCart = () => {
    add(product, qty);
    toast.success("Producto agregado al carrito", {
      description: `${qty} x ${product.name}`,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-brand-royal">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/catalogo" className="hover:text-brand-royal">Catálogo</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-deep font-semibold truncate">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="premium-panel relative overflow-hidden rounded-3xl aspect-square">
            <div className="absolute inset-x-0 top-0 z-10 h-px gold-hairline" />
            <img src={gallery[active]} alt={product.name} className="h-full w-full object-cover" />
            {product.badge && (
              <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider shadow-md
                ${product.badge === "Oferta" ? "bg-brand-gold text-brand-night" : product.badge === "Nuevo" ? "bg-brand-royal text-white" : "bg-brand-deep text-white"}`}>
                {product.badge}
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {gallery.map((g: string, i: number) => (
              <button key={i} onClick={() => setActive(i)} className={`aspect-square overflow-hidden rounded-xl border-2 bg-white transition hover:border-brand-royal/40 ${active === i ? "border-brand-royal shadow-md shadow-brand-royal/15" : "border-transparent"}`}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-brand-soft px-3 py-1 font-semibold uppercase tracking-wider text-brand-royal">{product.category}</span>
            <span className="rounded-full bg-brand-gold-soft px-3 py-1 font-bold text-brand-night">Stock disponible ({product.stock})</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-brand-deep sm:text-4xl">{product.name}</h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-brand-royal">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                <span className="rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-black text-brand-night">-{discount}%</span>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-foreground/80">{product.description}</p>

          <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            {product.features.map((f: string) => (
              <li key={f} className="flex items-center gap-2 rounded-xl border border-brand-royal/10 bg-white px-3 py-2 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-royal" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-brand-royal/10 bg-brand-soft/60">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center text-brand-deep hover:bg-white rounded-l-full"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center text-brand-deep hover:bg-white rounded-r-full"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={addToCart} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-brand-royal to-brand-deep px-5 py-3 font-bold text-white btn-glow transition hover:-translate-y-0.5 hover:shadow-lg">
              <ShoppingCart className="h-4 w-4" /> Agregar al carrito
            </button>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { i: Headphones, t: "Atención personalizada" },
              { i: ShieldCheck, t: "Compra segura" },
              { i: Truck, t: "Envíos disponibles" },
            ].map((b) => (
              <div key={b.t} className="premium-panel rounded-xl p-3 text-center">
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
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}


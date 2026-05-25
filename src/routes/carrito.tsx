import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Truck, MessageCircle, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { createCheckoutWhatsAppUrl, formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/carrito")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Tu carrito | L&A Multiventas" }] }),
});

function CartPage() {
  const { items, total, setQty, remove } = useCart();
  const shipping = items.length ? 25000 : 0;
  const checkoutUrl = createCheckoutWhatsAppUrl(items, shipping);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
      <Link to="/catalogo" className="inline-flex items-center gap-1 text-sm text-brand-royal hover:gap-2 transition-all">
        <ArrowLeft className="h-4 w-4" /> Seguir comprando
      </Link>
      <h1 className="mt-4 font-display text-4xl font-bold text-brand-deep">Tu carrito</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand-royal">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <p className="mt-4 font-display text-xl font-bold text-brand-deep">Tu carrito está vacío</p>
          <p className="mt-1 text-muted-foreground">Explorá el catálogo y sumá tus favoritos.</p>
          <Link to="/catalogo" className="mt-5 inline-flex rounded-full bg-brand-royal px-6 py-3 font-semibold text-white btn-glow">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 card-hover">
                <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link to="/producto/$id" params={{ id: product.id }} className="font-display font-bold text-brand-deep hover:text-brand-royal">{product.name}</Link>
                    <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button onClick={() => setQty(product.id, qty - 1)} className="grid h-8 w-8 place-items-center hover:bg-brand-soft rounded-l-full"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                      <button onClick={() => setQty(product.id, qty + 1)} className="grid h-8 w-8 place-items-center hover:bg-brand-soft rounded-r-full"><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="font-display font-bold text-brand-royal">{formatPrice(product.price * qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold text-brand-deep">Resumen</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Envío estimado</span><span>{formatPrice(shipping)}</span></div>
                <div className="my-3 border-t border-border" />
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-bold text-brand-deep">Total</span>
                  <span className="font-display text-2xl font-bold text-brand-royal">{formatPrice(total + shipping)}</span>
                </div>
              </div>
              <a href={checkoutUrl} target="_blank" rel="noreferrer" className="mt-5 flex w-full items-center justify-center rounded-xl bg-brand-royal py-3 font-semibold text-white btn-glow hover:opacity-90">
                Finalizar compra
              </a>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Al finalizar te derivamos a WhatsApp con el detalle del pedido.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-brand-soft/50 p-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-brand-deep"><ShieldCheck className="h-4 w-4 text-brand-royal" /> Compra 100% segura</div>
              <div className="flex items-center gap-2 text-brand-deep"><Truck className="h-4 w-4 text-brand-royal" /> Coordinamos envío al toque</div>
              <div className="flex items-center gap-2 text-brand-deep"><MessageCircle className="h-4 w-4 text-brand-royal" /> Atención por WhatsApp</div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

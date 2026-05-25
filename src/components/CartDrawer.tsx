import { X, Minus, Plus, Trash2, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-context";
import { formatPrice, WHATSAPP_URL } from "@/lib/mock-data";

export function CartDrawer() {
  const { isOpen, close, items, total, setQty, remove } = useCart();

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-brand-night/60 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-royal text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display font-bold text-brand-deep">Tu carrito</div>
              <div className="text-xs text-muted-foreground">{items.length} producto(s)</div>
            </div>
          </div>
          <button onClick={close} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-brand-soft transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand-royal">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <p className="mt-4 font-semibold text-brand-deep">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-muted-foreground">Sumá productos y aprovechá las ofertas.</p>
              <button onClick={close} className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-royal px-5 py-2.5 text-sm font-semibold text-white btn-glow">
                Seguir comprando
              </button>
            </div>
          )}

          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-3 rounded-2xl border border-border p-3 animate-fade-up">
              <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="line-clamp-2 text-sm font-semibold text-brand-deep">{product.name}</h4>
                  <button onClick={() => remove(product.id)} aria-label="Eliminar" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="grid h-7 w-7 place-items-center text-brand-deep hover:bg-brand-soft rounded-l-full"><Minus className="h-3 w-3" /></button>
                    <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="grid h-7 w-7 place-items-center text-brand-deep hover:bg-brand-soft rounded-r-full"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="font-display text-sm font-bold text-brand-royal">{formatPrice(product.price * qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border bg-brand-soft/40 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-brand-deep">Total</span>
              <span className="font-display text-xl font-bold text-brand-royal">{formatPrice(total)}</span>
            </div>
            <Link onClick={close} to="/carrito" className="flex items-center justify-center gap-2 rounded-xl bg-brand-royal px-4 py-3 font-semibold text-white btn-glow hover:opacity-90">
              Finalizar compra <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600">
              <MessageCircle className="h-4 w-4" /> Comprar por WhatsApp
            </a>
            <p className="text-center text-[11px] text-muted-foreground">
              También podés cerrar tu pedido hablando directo con nosotros.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

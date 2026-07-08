import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, Phone, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, type OrderStatus } from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/mock-data";
import { formatAdminError } from "@/lib/error-format";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminOrders, updateAdminOrderStatus } from "@/backend/admin-store";
import { cn } from "@/lib/utils";

const STATUSES: OrderStatus[] = ["draft", "pending", "confirmed", "paid", "delivered", "cancelled"];

export const Route = createFileRoute("/admin/pedidos")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const orders = await listAdminOrders();
    return { admin, orders };
  },
  component: AdminOrders,
  head: () => ({ meta: [{ title: "Pedidos | L&A Multiventas" }] }),
});

function AdminOrders() {
  const { admin, orders } = Route.useLoaderData();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    STATUSES.forEach((s) => {
      map[s] = orders.filter((o: any) => o.status === s).length;
    });
    return map;
  }, [orders]);

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o: any) => o.status === filter)),
    [filter, orders],
  );

  const changeStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateAdminOrderStatus({ data: { id, status: status as any } });
      toast.success("Estado actualizado");
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo actualizar el estado."));
    }
  };

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Pedidos"
        description="Seguimiento de pedidos e intenciones por WhatsApp."
        icon={<ShoppingBag className="h-5 w-5" />}
      />

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all" as const, ...STATUSES]).map((k) => {
          const label = k === "all" ? "Todos" : k.charAt(0).toUpperCase() + k.slice(1);
          return (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition",
                filter === k
                  ? "border-[color:var(--mg-magenta)] bg-mg-magenta-gradient text-white shadow-mg-glow"
                  : "border-mg-line bg-mg-ink text-mg-muted hover:border-[color:var(--mg-magenta)]/40 hover:text-mg-text",
              )}
            >
              {label} <span className="ml-1 opacity-70">({counts[k] ?? 0})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-mg-line bg-mg-ink p-12 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-mg-muted opacity-50" />
            <p className="mt-3 font-display text-lg font-bold text-mg-text">
              {orders.length === 0 ? "Todavía no hay pedidos" : "Sin coincidencias"}
            </p>
            <p className="mt-1 text-sm text-mg-muted">
              {orders.length === 0
                ? "Los pedidos del checkout público aparecerán acá."
                : "Probá con otro filtro."}
            </p>
          </div>
        ) : (
          filtered.map((order: any) => (
            <article key={order.id} className="rounded-2xl border border-mg-line bg-mg-ink p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-mg-text">{order.order_number}</h2>
                    <StatusBadge status={order.status} size="sm" />
                    <span className="text-xs text-mg-muted">
                      {new Date(order.created_at).toLocaleString("es-PY")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-mg-text/85">
                    <strong>{order.customer_name || "Cliente sin nombre"}</strong>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mg-muted">
                    {order.customer_phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {order.customer_phone}
                      </span>
                    )}
                    {order.customer_email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {order.customer_email}
                      </span>
                    )}
                    {order.customer_address && <span>📍 {order.customer_address}</span>}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-[color:var(--mg-magenta)]">
                    {formatPrice(order.total)}
                  </div>
                  <div className="text-[11px] text-mg-muted">
                    Subt {formatPrice(order.subtotal)} · Envío {formatPrice(order.shipping_cost)}
                  </div>
                  <select
                    value={order.status}
                    onChange={(event) => changeStatus(order.id, event.target.value as OrderStatus)}
                    className="mt-3 rounded-lg border border-mg-line bg-mg-ink-soft px-3 py-2 text-sm text-mg-text"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {order.whatsapp_message && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-mg-muted hover:text-mg-text">
                    Mensaje de WhatsApp
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-mg-ink-soft p-3 text-xs text-mg-text/85">
                    {order.whatsapp_message}
                  </pre>
                </details>
              )}

              {order.notes && (
                <p className="mt-3 rounded-lg bg-mg-ink-soft p-3 text-xs text-mg-text/85">
                  <strong>Notas:</strong> {order.notes}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

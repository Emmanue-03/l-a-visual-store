import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPrice } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/catalog-types";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminOrders, updateAdminOrderStatus } from "@/backend/admin-store";

const statuses: OrderStatus[] = ["draft", "pending", "confirmed", "paid", "cancelled", "delivered"];

export const Route = createFileRoute("/admin/pedidos")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const orders = await listAdminOrders();
    return { admin, orders };
  },
  component: AdminOrders,
});

function AdminOrders() {
  const { admin, orders } = Route.useLoaderData();
  const router = useRouter();

  const changeStatus = async (id: string, status: OrderStatus) => {
    await updateAdminOrderStatus({ data: { id, status } });
    toast.success("Estado actualizado");
    router.invalidate();
  };

  return (
    <AdminLayout admin={admin}>
      <h1 className="font-display text-2xl font-bold text-brand-deep">Pedidos</h1>
      <p className="text-sm text-slate-500">Seguimiento basico de pedidos e intenciones por WhatsApp.</p>

      <div className="mt-5 grid gap-4">
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Todavia no hay pedidos.</div>
        ) : orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-brand-deep">{order.order_number}</h2>
                <p className="text-sm text-slate-500">{order.customer_name || "Cliente sin nombre"} · {order.customer_phone || "sin telefono"}</p>
              </div>
              <div className="text-right">
                <div className="font-display text-xl font-bold text-brand-royal">{formatPrice(order.total)}</div>
                <select value={order.status} onChange={(event) => changeStatus(order.id, event.target.value as OrderStatus)} className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
            {order.whatsapp_message && (
              <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{order.whatsapp_message}</pre>
            )}
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}


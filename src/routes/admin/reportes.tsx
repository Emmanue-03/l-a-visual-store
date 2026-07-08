import { createFileRoute, redirect } from "@tanstack/react-router";
import { FileBarChart, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { getDashboardMetrics } from "@/backend/admin-dashboard";
import { formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/reportes")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const metrics = await getDashboardMetrics();
    return { admin, metrics };
  },
  component: AdminReports,
  head: () => ({ meta: [{ title: "Reportes | L&A Multiventas" }] }),
});

function AdminReports() {
  const { admin, metrics } = Route.useLoaderData();
  const { totals, revenue, recentOrders } = metrics;

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Reportes"
        description="Indicadores básicos calculados sobre tu base actual."
        icon={<FileBarChart className="h-5 w-5" />}
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat title="Ventas últimos 7 días" value={formatPrice(revenue.last7Days)} />
        <Stat title="Ventas últimos 30 días" value={formatPrice(revenue.last30Days)} />
        <Stat title="Productos activos" value={String(totals.activeProducts)} />
        <Stat title="Pedidos pendientes" value={String(totals.pendingOrders)} />
        <Stat title="Stock crítico" value={String(totals.lowStockCount + totals.outOfStockCount)} />
        <Stat title="Categorías activas" value={String(totals.activeCategories)} />
      </section>

      <section className="mt-8 rounded-2xl border border-mg-line bg-mg-ink p-6 shadow-sm">
        <div className="flex items-center gap-2 text-mg-text">
          <TrendingUp className="h-4 w-4 text-[color:var(--mg-magenta)]" />
          <h3 className="font-display text-base font-bold">Últimos pedidos</h3>
        </div>
        {recentOrders.length === 0 ? (
          <p className="mt-3 text-sm text-mg-muted">Aún no hay pedidos para reportar.</p>
        ) : (
          <ul className="mt-3 divide-y divide-mg-line">
            {recentOrders.map((o: any) => (
              <li key={o.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <span className="font-mono font-bold text-[color:var(--mg-magenta)]">{o.order_number}</span>{" "}
                  <span className="text-mg-muted">· {o.customer_name ?? "sin nombre"} · {o.status}</span>
                </div>
                <span className="font-bold text-[color:var(--mg-gold-deep)]">{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-6 text-xs text-mg-muted">
        Los gráficos avanzados (series temporales, embudo, top categorías) requieren agregaciones
        adicionales en base. Si los necesitás, podemos definir vistas SQL sobre <code>orders</code> y
        <code>order_items</code>.
      </p>
    </AdminLayout>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink p-5 shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-mg-muted">{title}</div>
      <div className="mt-2 font-display text-3xl font-bold text-mg-text">{value}</div>
    </div>
  );
}

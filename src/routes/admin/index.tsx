import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Boxes,
  Clock,
  FolderTree,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { getDashboardMetrics } from "@/backend/admin-dashboard";
import { formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const metrics = await getDashboardMetrics();
    return { admin, metrics };
  },
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Dashboard | L&A Multiventas" }] }),
});

function formatNumber(n: number) {
  return new Intl.NumberFormat("es-PY").format(n);
}

function AdminDashboard() {
  const { admin, metrics } = Route.useLoaderData();
  const { totals, revenue, recentOrders, lowStock } = metrics;

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title={`Hola, ${admin.fullName?.split(" ")[0] || "Admin"} 👋`}
        description="Resumen en vivo de tu tienda L&A Multiventas."
        actions={
          <Button asChild className="bg-mg-magenta-gradient text-white shadow-mg-glow hover:opacity-95">
            <Link to="/admin/productos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo producto
            </Link>
          </Button>
        }
      />

      {/* KPIs principales */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Productos totales"
          value={formatNumber(totals.products)}
          sub={`${totals.activeProducts} activos`}
          icon={Package}
          tone="blue"
        />
        <Kpi
          label="Stock crítico"
          value={formatNumber(totals.lowStockCount + totals.outOfStockCount)}
          sub={`${totals.outOfStockCount} agotados · ${totals.lowStockCount} bajo umbral`}
          icon={Boxes}
          tone={totals.outOfStockCount > 0 ? "rose" : "amber"}
        />
        <Kpi
          label="Categorías activas"
          value={formatNumber(totals.activeCategories)}
          sub="Visibles en el catálogo"
          icon={FolderTree}
          tone="blue"
        />
        <Kpi
          label="Pedidos pendientes"
          value={formatNumber(totals.pendingOrders)}
          sub="Requieren acción"
          icon={Clock}
          tone={totals.pendingOrders > 0 ? "gold" : "blue"}
        />
      </section>

      {/* Ventas */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Kpi
          label="Ventas últimos 7 días"
          value={formatPrice(revenue.last7Days)}
          sub="Pedidos confirmados/pagados/entregados"
          icon={TrendingUp}
          tone="gold"
        />
        <Kpi
          label="Ventas últimos 30 días"
          value={formatPrice(revenue.last30Days)}
          sub="Pedidos confirmados/pagados/entregados"
          icon={Wallet}
          tone="gold"
        />
      </section>

      {/* Pedidos recientes + Stock crítico */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel
          title="Pedidos recientes"
          subtitle={recentOrders.length === 0 ? "Sin pedidos por ahora" : `Últimos ${recentOrders.length}`}
          action={
            <Button asChild variant="ghost" size="sm" className="text-mg-muted hover:text-[color:var(--mg-magenta)]">
              <Link to="/admin/pedidos">
                Ver todos <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          {recentOrders.length === 0 ? (
            <Empty icon={ShoppingBag} text="Cuando entren pedidos los vas a ver acá." />
          ) : (
            <div className="divide-y divide-mg-line/60">
              {recentOrders.map((o: any) => (
                <div key={o.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-3 hover:bg-mg-ink-soft/40 transition">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[color:var(--mg-magenta)]">{o.order_number}</span>
                      <StatusBadge status={o.status as any} size="xs" />
                    </div>
                    <div className="truncate text-xs text-mg-muted">
                      {o.customer_name || "Cliente sin nombre"} · {new Date(o.created_at).toLocaleDateString("es-PY")}
                    </div>
                  </div>
                  <div className="font-display text-base font-bold text-[color:var(--mg-gold)]">{formatPrice(o.total)}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Stock crítico"
          subtitle="Bajo umbral"
          action={
            <Button asChild variant="ghost" size="sm" className="text-mg-muted hover:text-[color:var(--mg-magenta)]">
              <Link to="/admin/inventario">
                Ver inventario <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          {lowStock.length === 0 ? (
            <Empty icon={Package} text="Sin alertas de stock 🎉" />
          ) : (
            <div className="divide-y divide-mg-line/60">
              {lowStock.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-mg-ink-soft/40 transition">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-mg-line" />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-mg-ink-soft text-mg-muted">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-mg-text">{p.name}</div>
                    <div className="text-[11px] text-mg-muted">{p.sku ?? "sin SKU"}</div>
                  </div>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300 border border-amber-400/30">
                    {p.stock} u
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </section>

      {/* Atajos */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Quick to="/admin/productos" icon={Package} label="Gestionar productos" />
        <Quick to="/admin/categorias" icon={FolderTree} label="Categorías" />
        <Quick to="/admin/pedidos" icon={ShoppingBag} label="Ver pedidos" />
        <Quick to="/admin/configuracion" icon={Wallet} label="Configuración" />
      </section>
    </AdminLayout>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "blue" | "gold" | "rose" | "amber";
}) {
  const toneCls = {
    blue: "bg-[color:var(--mg-magenta)]/10 text-[color:var(--mg-magenta)] ring-[color:var(--mg-magenta)]/30",
    gold: "bg-[color:var(--mg-gold)]/15 text-[color:var(--mg-gold-deep)] ring-[color:var(--mg-gold)]/40",
    rose: "bg-rose-500/10 text-rose-600 ring-rose-400/40",
    amber: "bg-amber-500/10 text-amber-600 ring-amber-400/40",
  }[tone];
  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-mg-muted">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold text-mg-text">{value}</div>
          {sub && <div className="mt-1 text-xs text-mg-muted">{sub}</div>}
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${toneCls}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-mg-line px-5 py-4">
        <div>
          <h3 className="font-display text-lg font-bold text-mg-text">{title}</h3>
          {subtitle && <p className="text-xs text-mg-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Empty({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-sm text-mg-muted">
      <Icon className="h-6 w-6 opacity-50" />
      <p>{text}</p>
    </div>
  );
}

function Quick({ to, icon: Icon, label }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl border border-mg-line bg-mg-ink p-4 shadow-sm transition hover:border-[color:var(--mg-magenta)]/50 hover:shadow"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--mg-magenta)]/10 text-[color:var(--mg-magenta)] transition group-hover:bg-mg-magenta-gradient group-hover:text-white">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold text-mg-text">{label}</span>
      </div>
      <ArrowUpRight className="h-4 w-4 text-mg-muted transition group-hover:text-[color:var(--mg-magenta)]" />
    </Link>
  );
}

import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { AlertTriangle, Boxes, FolderTree, Plus, ShoppingBag } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPrice } from "@/lib/mock-data";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { getAdminDashboard } from "@/backend/admin-store";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const dashboard = await getAdminDashboard();
    return { admin, dashboard };
  },
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin | L&A Multiventas" }] }),
});

function AdminDashboard() {
  const { admin, dashboard } = Route.useLoaderData();
  const stats = [
    { label: "Productos", value: dashboard.totalProducts, icon: Boxes },
    { label: "Activos", value: dashboard.activeProducts, icon: Boxes },
    { label: "Bajo stock", value: dashboard.lowStockProducts, icon: AlertTriangle },
    { label: "Categorias activas", value: dashboard.activeCategories, icon: FolderTree },
  ];

  return (
    <AdminLayout admin={admin}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-deep">Dashboard</h1>
          <p className="text-sm text-slate-500">Resumen operativo de la tienda.</p>
        </div>
        <Link to="/admin/productos/nuevo" className="inline-flex items-center gap-2 rounded-lg bg-brand-royal px-4 py-2 text-sm font-bold text-white">
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <stat.icon className="h-5 w-5 text-brand-royal" />
            <div className="mt-4 text-3xl font-bold text-brand-deep">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-lg font-bold text-brand-deep">Pedidos recientes</h2>
          <div className="mt-4 space-y-2">
            {dashboard.recentOrders.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 p-5 text-sm text-slate-500">Sin pedidos registrados todavia.</p>
            ) : dashboard.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                <div>
                  <div className="text-sm font-bold text-slate-800">{order.order_number}</div>
                  <div className="text-xs text-slate-500">{order.customer_name || "Cliente sin nombre"}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-brand-royal">{formatPrice(order.total)}</div>
                  <div className="text-xs text-slate-500">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-lg font-bold text-brand-deep">Accesos rapidos</h2>
          <div className="mt-4 grid gap-2">
            <Link to="/admin/productos" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">Gestionar productos</Link>
            <Link to="/admin/categorias" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">Gestionar categorias</Link>
            <Link to="/admin/pedidos" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">Ver pedidos</Link>
            <Link to="/catalogo" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">
              <ShoppingBag className="h-4 w-4" />
              Ver catalogo publico
            </Link>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

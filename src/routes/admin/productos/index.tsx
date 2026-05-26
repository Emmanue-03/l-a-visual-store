import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Edit, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPrice } from "@/lib/mock-data";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminProducts, setAdminProductActive } from "@/backend/admin-products";

export const Route = createFileRoute("/admin/productos/")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const products = await listAdminProducts();
    return { admin, products };
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { admin, products } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("todos");
  const router = useRouter();

  const filtered = useMemo(() => products.filter((product) => {
    const matchesText = [product.name, product.category, product.badge ?? ""].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "todos" ||
      (filter === "activos" && product.isActive) ||
      (filter === "inactivos" && !product.isActive) ||
      (filter === "stock-bajo" && product.stock <= (product.lowStockThreshold ?? 5));
    return matchesText && matchesFilter;
  }), [filter, products, query]);

  const toggleActive = async (id: string, isActive: boolean) => {
    await setAdminProductActive({ data: { id, is_active: !isActive } });
    toast.success(!isActive ? "Producto activado" : "Producto desactivado");
    router.invalidate();
  };

  return (
    <AdminLayout admin={admin}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-deep">Productos</h1>
          <p className="text-sm text-slate-500">Catalogo administrable conectado a DB.</p>
        </div>
        <Link to="/admin/productos/nuevo" className="inline-flex items-center gap-2 rounded-lg bg-brand-royal px-4 py-2 text-sm font-bold text-white">
          <Plus className="h-4 w-4" />
          Nuevo
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="flex min-w-64 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar producto..." className="w-full bg-transparent text-sm outline-none" />
        </label>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
          <option value="stock-bajo">Stock bajo</option>
        </select>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="h-11 w-11 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-500">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize">{product.categoryName ?? product.category}</td>
                <td className="px-4 py-3 font-semibold text-brand-royal">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {product.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to="/admin/productos/$id" params={{ id: product.id }} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => toggleActive(product.id, !!product.isActive)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50">
                      {product.isActive ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

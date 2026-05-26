import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Edit, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductDialog, type ProductDialogState } from "@/components/admin/ProductDialog";
import { formatPrice } from "@/lib/mock-data";
import { formatAdminError } from "@/lib/error-format";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminCategories } from "@/backend/admin-categories";
import { listAdminProducts, setAdminProductActive } from "@/backend/admin-products";

export const Route = createFileRoute("/admin/productos/")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const [products, categories] = await Promise.all([
      listAdminProducts(),
      listAdminCategories(),
    ]);
    return { admin, products, categories };
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { admin, products, categories } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("todos");
  const [dialog, setDialog] = useState<ProductDialogState>({ mode: "closed" });
  const router = useRouter();

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesText = [
          product.name,
          product.category_slug ?? "",
          product.category_name ?? "",
          product.badge ?? "",
          product.sku ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const minStock = product.low_stock_threshold ?? 5;
        const stock = product.stock ?? 0;
        const matchesFilter =
          filter === "todos" ||
          (filter === "activos" && product.is_active) ||
          (filter === "inactivos" && !product.is_active) ||
          (filter === "stock-bajo" && stock <= minStock);
        return matchesText && matchesFilter;
      }),
    [filter, products, query],
  );

  const toggleActive = async (id: string, currentlyActive: boolean) => {
    try {
      await setAdminProductActive({ data: { id, is_active: !currentlyActive } });
      toast.success(currentlyActive ? "Producto desactivado" : "Producto activado");
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo cambiar el estado."));
    }
  };

  return (
    <AdminLayout admin={admin}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-deep">Productos</h1>
          <p className="text-sm text-slate-500">Catalogo administrable conectado a DB.</p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-royal px-4 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="flex min-w-64 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, SKU, categoria, badge..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  {products.length === 0
                    ? "Todavia no hay productos. Crea el primero con «Nuevo producto»."
                    : "No hay resultados para los filtros aplicados."}
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-11 w-11 rounded-lg bg-slate-100 object-cover"
                        onError={(event) => {
                          (event.currentTarget as HTMLImageElement).style.opacity = "0.2";
                        }}
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {product.category_name ?? product.category_slug ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-royal">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{product.stock ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${
                        product.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setDialog({ mode: "edit", product })}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
                        aria-label={`Editar ${product.name}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(product.id, Boolean(product.is_active))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50"
                      >
                        {product.is_active ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductDialog
        state={dialog}
        categories={categories}
        onClose={() => setDialog({ mode: "closed" })}
        onSaved={() => {
          setDialog({ mode: "closed" });
          router.invalidate();
        }}
      />
    </AdminLayout>
  );
}

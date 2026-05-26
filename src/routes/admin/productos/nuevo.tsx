import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminCategories } from "@/backend/admin-categories";
import { saveAdminProduct } from "@/backend/admin-products";
import { formatAdminError } from "@/lib/error-format";

export const Route = createFileRoute("/admin/productos/nuevo")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const categories = await listAdminCategories();
    return { admin, categories };
  },
  component: NewProduct,
});

function NewProduct() {
  const { admin, categories } = Route.useLoaderData();
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  return (
    <AdminLayout admin={admin}>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-brand-deep">Nuevo producto</h1>
        <p className="text-sm text-slate-500">Al guardar se refleja en el catalogo publico si esta activo.</p>
      </div>
      <ProductForm
        categories={categories}
        submitting={saving}
        onSubmit={async (payload) => {
          setSaving(true);
          try {
            const product = await saveAdminProduct({ data: payload });
            toast.success("Producto creado");
            navigate({ to: "/admin/productos/$id", params: { id: product?.id ?? "" } });
          } catch (error) {
            toast.error(formatAdminError(error, "No se pudo guardar el producto."));
          } finally {
            setSaving(false);
          }
        }}
      />
    </AdminLayout>
  );
}


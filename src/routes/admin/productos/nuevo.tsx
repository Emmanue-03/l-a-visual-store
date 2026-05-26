import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
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
  const router = useRouter();

  return (
    <AdminLayout admin={admin}>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-brand-deep">Nuevo producto</h1>
        <p className="text-sm text-slate-500">
          Para que aparezca en el catalogo publico el producto tiene que estar <strong>Activo</strong>.
        </p>
      </div>
      <ProductForm
        categories={categories}
        submitting={saving}
        onSubmit={async (payload) => {
          setSaving(true);
          try {
            const product = await saveAdminProduct({ data: payload });
            // Invalidar todo el router para que el catalogo publico
            // (que vive bajo el root loader) re-fetchee al navegar.
            await router.invalidate();
            if (!payload.is_active) {
              toast.warning(
                "Producto guardado como INACTIVO. No se ve en el catalogo hasta que lo actives.",
              );
            } else {
              toast.success("Producto creado y publicado en el catalogo.");
            }
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

import { createFileRoute, notFound, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminCategories } from "@/backend/admin-categories";
import { getAdminProduct, saveAdminProduct } from "@/backend/admin-products";
import { formatAdminError } from "@/lib/error-format";

export const Route = createFileRoute("/admin/productos/$id")({
  loader: async ({ params }) => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const [product, categories] = await Promise.all([
      getAdminProduct({ data: { id: params.id } }),
      listAdminCategories(),
    ]);
    if (!product) throw notFound();
    return { admin, product, categories };
  },
  component: EditProduct,
});

function EditProduct() {
  const { admin, product, categories } = Route.useLoaderData();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  return (
    <AdminLayout admin={admin}>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-brand-deep">Editar producto</h1>
        <p className="text-sm text-slate-500">{product.name}</p>
      </div>
      <ProductForm
        product={product}
        categories={categories}
        submitting={saving}
        onSubmit={async (payload) => {
          setSaving(true);
          try {
            await saveAdminProduct({ data: payload });
            await router.invalidate();
            if (!payload.is_active) {
              toast.warning(
                "Cambios guardados. El producto esta INACTIVO y no se ve en el catalogo publico.",
              );
            } else {
              toast.success("Producto actualizado");
            }
          } catch (error) {
            toast.error(formatAdminError(error, "No se pudo actualizar el producto."));
          } finally {
            setSaving(false);
          }
        }}
      />
    </AdminLayout>
  );
}


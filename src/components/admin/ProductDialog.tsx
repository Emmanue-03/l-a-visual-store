import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveAdminProduct } from "@/backend/admin-products";
import type { AdminCategoryRow } from "@/backend/admin-categories";
import type { DbProduct } from "@/lib/catalog-mappers";
import { formatAdminError } from "@/lib/error-format";

export type ProductDialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; product: DbProduct };

type Props = {
  state: ProductDialogState;
  categories: AdminCategoryRow[];
  onClose: () => void;
  onSaved: () => void;
};

export function ProductDialog({ state, categories, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const open = state.mode !== "closed";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !saving && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {state.mode === "edit" ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
          <DialogDescription>
            {state.mode === "edit"
              ? "Modifica los campos del producto. Marca «Activo» para publicarlo en el catalogo."
              : "Completa los datos del producto. Para que aparezca en el catalogo publico tiene que quedar Activo."}
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          product={state.mode === "edit" ? state.product : null}
          categories={categories}
          submitting={saving}
          onSubmit={async (payload) => {
            setSaving(true);
            try {
              await saveAdminProduct({ data: payload });
              if (!payload.is_active) {
                toast.warning(
                  state.mode === "edit"
                    ? "Cambios guardados. Sigue INACTIVO y no se ve en el catalogo."
                    : "Producto guardado como INACTIVO. No se ve en el catalogo hasta que lo actives.",
                );
              } else {
                toast.success(
                  state.mode === "edit"
                    ? "Producto actualizado y visible en el catalogo."
                    : "Producto creado y publicado en el catalogo.",
                );
              }
              onSaved();
            } catch (error) {
              toast.error(
                formatAdminError(
                  error,
                  state.mode === "edit"
                    ? "No se pudo actualizar el producto."
                    : "No se pudo guardar el producto.",
                ),
              );
            } finally {
              setSaving(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

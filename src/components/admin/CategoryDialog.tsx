import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveAdminCategory, type AdminCategoryRow } from "@/backend/admin-categories";
import { formatAdminError } from "@/lib/error-format";
import { CATEGORY_ICON_NAMES, resolveCategoryIcon } from "@/lib/category-icons";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type Mode = { mode: "closed" } | { mode: "create" } | { mode: "edit"; category: AdminCategoryRow };

type Props = {
  state: Mode;
  onClose: () => void;
  onSaved: () => void;
};

type FormState = {
  name: string;
  slug: string;
  icon: string;
  sortOrder: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
  isActive: boolean;
};

const emptyForm = (): FormState => ({
  name: "",
  slug: "",
  icon: "",
  sortOrder: "0",
  description: "",
  seoTitle: "",
  seoDescription: "",
  isFeatured: false,
  isActive: true,
});

// Supabase devuelve snake_case (seo_title/seo_description) aunque el tipo TS
// mezcle camelCase. Casteamos a un shape "honesto" para leer los datos reales.
type CategoryRowRaw = {
  seo_title?: string | null;
  seo_description?: string | null;
};

function fromCategory(c: AdminCategoryRow): FormState {
  const raw = c as unknown as CategoryRowRaw;
  return {
    name: c.name,
    slug: c.slug,
    icon: c.icon ?? "",
    sortOrder: String(c.sort_order ?? 0),
    description: c.description ?? "",
    seoTitle: raw.seo_title ?? c.seoTitle ?? "",
    seoDescription: raw.seo_description ?? c.seoDescription ?? "",
    isFeatured: Boolean(c.is_featured),
    isActive: Boolean(c.is_active),
  };
}

export function CategoryDialog({ state, onClose, onSaved }: Props) {
  const open = state.mode !== "closed";
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (state.mode === "create") setForm(emptyForm());
    if (state.mode === "edit") setForm(fromCategory(state.category));
  }, [state]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    if (name.length < 2) {
      toast.error("Nombre: minimo 2 caracteres.");
      return;
    }
    const slug = form.slug.trim() || slugify(name);
    if (!slug) {
      toast.error("Slug invalido. Probá ingresar un nombre con letras.");
      return;
    }

    setSaving(true);
    try {
      await saveAdminCategory({
        data: {
          id: state.mode === "edit" ? state.category.id : undefined,
          name,
          slug,
          description: form.description.trim(),
          icon: form.icon.trim(),
          sort_order: Number(form.sortOrder) || 0,
          is_featured: form.isFeatured,
          is_active: form.isActive,
          seo_title: form.seoTitle.trim(),
          seo_description: form.seoDescription.trim(),
        },
      });
      toast.success(state.mode === "edit" ? "Categoria actualizada" : "Categoria creada");
      onSaved();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo guardar la categoria."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{state.mode === "edit" ? "Editar categoria" : "Nueva categoria"}</DialogTitle>
          <DialogDescription>
            {state.mode === "edit"
              ? "Modifica los datos de la categoria. Los cambios se reflejan en el catalogo si esta activa."
              : "Crea una nueva categoria. El slug se genera del nombre si lo dejas vacio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Nombre"
              value={form.name}
              onChange={(value) => update("name", value)}
              required
              placeholder="Tecnologia"
            />
            <Field
              label="Slug"
              value={form.slug}
              onChange={(value) => update("slug", value)}
              placeholder="Se autogenera si queda vacio"
            />
            <IconPicker value={form.icon} onChange={(value) => update("icon", value)} />
            <Field
              label="Orden"
              type="number"
              value={form.sortOrder}
              onChange={(value) => update("sortOrder", value)}
            />
          </div>

          <Textarea
            label="Descripcion"
            value={form.description}
            onChange={(value) => update("description", value)}
            rows={2}
          />

          <Field
            label="SEO title"
            value={form.seoTitle}
            onChange={(value) => update("seoTitle", value)}
          />
          <Textarea
            label="SEO description"
            value={form.seoDescription}
            onChange={(value) => update("seoDescription", value)}
            rows={2}
          />

          <div className="flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Toggle
              label="Destacada"
              checked={form.isFeatured}
              onChange={(value) => update("isFeatured", value)}
            />
            <Toggle
              label="Activa"
              checked={form.isActive}
              onChange={(value) => update("isActive", value)}
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-royal px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving
                ? "Guardando..."
                : state.mode === "edit"
                  ? "Guardar cambios"
                  : "Crear categoria"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-royal"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-royal"
      />
    </label>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const Preview = resolveCategoryIcon(value);
  return (
    <label className="block text-sm font-semibold text-slate-700">
      Icono
      <div className="mt-1 flex gap-2">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-brand-soft text-brand-royal">
          <Preview className="h-5 w-5" />
        </div>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-royal"
        >
          <option value="">Sin icono (carpeta)</option>
          {CATEGORY_ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 accent-brand-royal"
      />
      {label}
    </label>
  );
}

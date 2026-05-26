import { FormEvent } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { AdminCategoryRow } from "@/backend/admin-categories";
import type { DbProduct } from "@/lib/catalog-mappers";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type ProductPayload = {
  id?: string;
  sku?: string | null;
  slug: string;
  name: string;
  description: string;
  short_description?: string | null;
  category_id?: string | null;
  price: number;
  old_price?: number | null;
  cost_price?: number | null;
  rating: number;
  reviews_count: number;
  badge?: "Oferta" | "Nuevo" | "Top venta" | null;
  stock: number;
  low_stock_threshold: number;
  image_url: string;
  gallery_urls: string[];
  features: string[];
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  sort_order: number;
  seo_title?: string | null;
  seo_description?: string | null;
};

type ProductFormProps = {
  product?: DbProduct | null;
  categories: AdminCategoryRow[];
  onSubmit: (payload: ProductPayload) => Promise<void>;
  submitting?: boolean;
};

export function ProductForm({ product, categories, onSubmit, submitting }: ProductFormProps) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const slug = String(form.get("slug") || slugify(name));
    const lines = (key: string) => String(form.get(key) ?? "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);

    await onSubmit({
      id: product?.id,
      sku: String(form.get("sku") || "") || null,
      slug,
      name,
      description: String(form.get("description") ?? ""),
      short_description: String(form.get("short_description") || "") || null,
      category_id: String(form.get("category_id") || "") || null,
      price: Number(form.get("price") || 0),
      old_price: form.get("old_price") ? Number(form.get("old_price")) : null,
      cost_price: form.get("cost_price") ? Number(form.get("cost_price")) : null,
      rating: Number(form.get("rating") || 0),
      reviews_count: Number(form.get("reviews_count") || 0),
      badge: (String(form.get("badge") || "") || null) as ProductPayload["badge"],
      stock: Number(form.get("stock") || 0),
      low_stock_threshold: Number(form.get("low_stock_threshold") || 5),
      image_url: String(form.get("image_url") ?? ""),
      gallery_urls: lines("gallery_urls"),
      features: lines("features"),
      is_active: form.get("is_active") === "on",
      is_featured: form.get("is_featured") === "on",
      is_best_seller: form.get("is_best_seller") === "on",
      is_new_arrival: form.get("is_new_arrival") === "on",
      sort_order: Number(form.get("sort_order") || 0),
      seo_title: String(form.get("seo_title") || "") || null,
      seo_description: String(form.get("seo_description") || "") || null,
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" name="name" defaultValue={product?.name} required />
          <Field label="Slug" name="slug" defaultValue={product?.slug} placeholder="se genera si queda vacio" />
          <Field label="SKU" name="sku" defaultValue={product?.sku ?? ""} />
          <label className="text-sm font-semibold text-slate-700">
            Categoria
            <select name="category_id" defaultValue={product?.category_id ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Sin categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <Field label="Precio" name="price" type="number" defaultValue={product?.price} required />
          <Field label="Precio anterior" name="old_price" type="number" defaultValue={product?.old_price ?? ""} />
          <Field label="Costo" name="cost_price" type="number" defaultValue={product?.cost_price ?? ""} />
          <Field label="Stock" name="stock" type="number" defaultValue={product?.stock ?? 0} />
          <Field label="Stock minimo" name="low_stock_threshold" type="number" defaultValue={product?.low_stock_threshold ?? 5} />
          <Field label="Rating" name="rating" type="number" step="0.1" defaultValue={product?.rating ?? 0} />
          <Field label="Resenas" name="reviews_count" type="number" defaultValue={product?.reviews_count ?? 0} />
          <label className="text-sm font-semibold text-slate-700">
            Badge
            <select name="badge" defaultValue={product?.badge ?? ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Sin badge</option>
              <option value="Oferta">Oferta</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Top venta">Top venta</option>
            </select>
          </label>
        </div>
        <Textarea label="Descripcion corta" name="short_description" defaultValue={product?.short_description ?? ""} />
        <Textarea label="Descripcion" name="description" defaultValue={product?.description ?? ""} required />
        <Textarea label="Features (uno por linea o separado por coma)" name="features" defaultValue={(product?.features ?? []).join("\n")} />
      </section>

      <aside className="space-y-4">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <Field label="Imagen principal URL" name="image_url" type="url" defaultValue={product?.image_url} required />
          <Textarea label="Galeria URLs" name="gallery_urls" defaultValue={(product?.gallery_urls ?? []).join("\n")} />
          <Field label="Orden" name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} />
          <Checkbox label="Activo" name="is_active" defaultChecked={product?.is_active ?? true} />
          <Checkbox label="Destacado" name="is_featured" defaultChecked={product?.is_featured ?? false} />
          <Checkbox label="Top venta" name="is_best_seller" defaultChecked={product?.is_best_seller ?? false} />
          <Checkbox label="Nuevo ingreso" name="is_new_arrival" defaultChecked={product?.is_new_arrival ?? false} />
        </section>
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <Field label="SEO title" name="seo_title" defaultValue={product?.seo_title ?? ""} />
          <Textarea label="SEO description" name="seo_description" defaultValue={product?.seo_description ?? ""} />
          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-brand-royal px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
            {submitting ? "Guardando..." : "Guardar producto"}
          </button>
        </section>
      </aside>
    </form>
  );
}

function Field(props: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <input {...inputProps} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
    </label>
  );
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...textareaProps } = props;
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <textarea {...textareaProps} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
    </label>
  );
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-slate-300" />
      {label}
    </label>
  );
}


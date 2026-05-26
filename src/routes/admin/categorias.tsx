import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { FormEvent } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminCategories, saveAdminCategory, setAdminCategoryActive } from "@/backend/admin-categories";

const slugify = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const Route = createFileRoute("/admin/categorias")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const categories = await listAdminCategories();
    return { admin, categories };
  },
  component: AdminCategories,
});

function AdminCategories() {
  const { admin, categories } = Route.useLoaderData();
  const router = useRouter();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    await saveAdminCategory({
      data: {
        id: String(form.get("id") || "") || undefined,
        name,
        slug: String(form.get("slug") || slugify(name)),
        description: String(form.get("description") || ""),
        icon: String(form.get("icon") || ""),
        sort_order: Number(form.get("sort_order") || 0),
        is_featured: form.get("is_featured") === "on",
        is_active: form.get("is_active") === "on",
        seo_title: String(form.get("seo_title") || ""),
        seo_description: String(form.get("seo_description") || ""),
      },
    });
    toast.success("Categoria guardada");
    event.currentTarget.reset();
    router.invalidate();
  };

  const toggle = async (id: string, isActive: boolean) => {
    await setAdminCategoryActive({ data: { id, is_active: !isActive } });
    toast.success(!isActive ? "Categoria activada" : "Categoria desactivada");
    router.invalidate();
  };

  return (
    <AdminLayout admin={admin}>
      <h1 className="font-display text-2xl font-bold text-brand-deep">Categorias</h1>
      <p className="text-sm text-slate-500">Crear, editar y ordenar categorias del catalogo.</p>

      <form onSubmit={submit} className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 lg:grid-cols-4">
        <input name="name" required placeholder="Nombre" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input name="slug" placeholder="Slug automatico" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input name="icon" placeholder="Icono lucide (Cpu)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input name="sort_order" type="number" placeholder="Orden" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <textarea name="description" placeholder="Descripcion" className="rounded-lg border border-slate-200 px-3 py-2 text-sm lg:col-span-2" />
        <textarea name="seo_description" placeholder="SEO description" className="rounded-lg border border-slate-200 px-3 py-2 text-sm lg:col-span-2" />
        <input name="seo_title" placeholder="SEO title" className="rounded-lg border border-slate-200 px-3 py-2 text-sm lg:col-span-2" />
        <label className="flex items-center gap-2 text-sm font-semibold"><input name="is_featured" type="checkbox" /> Destacada</label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input name="is_active" type="checkbox" defaultChecked /> Activa</label>
        <button className="rounded-lg bg-brand-royal px-4 py-2 text-sm font-bold text-white">Crear categoria</button>
      </form>

      <div className="mt-5 grid gap-3">
        {categories.map((category) => (
          <form key={category.id} onSubmit={submit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_1fr_120px_120px_auto]">
            <input type="hidden" name="id" value={category.id} />
            <input name="name" defaultValue={category.name} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="slug" defaultValue={category.slug} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="icon" defaultValue={category.icon ?? ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="sort_order" type="number" defaultValue={category.sort_order} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <div className="flex flex-wrap items-center justify-end gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold"><input name="is_featured" type="checkbox" defaultChecked={category.is_featured} /> Dest.</label>
              <label className="flex items-center gap-2 text-xs font-semibold"><input name="is_active" type="checkbox" defaultChecked={category.is_active} /> Act.</label>
              <button type="submit" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">Guardar</button>
              <button type="button" onClick={() => toggle(category.id, category.is_active)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">
                {category.is_active ? "Desactivar" : "Activar"}
              </button>
            </div>
          </form>
        ))}
      </div>
    </AdminLayout>
  );
}


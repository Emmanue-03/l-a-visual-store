import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FolderTree,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoryDialog } from "@/components/admin/CategoryDialog";
import { getCurrentAdmin } from "@/backend/admin-auth";
import {
  deleteAdminCategory,
  listAdminCategories,
  setAdminCategoryActive,
  type AdminCategoryRow,
} from "@/backend/admin-categories";
import { formatAdminError } from "@/lib/error-format";
import { resolveCategoryIcon } from "@/lib/category-icons";

export const Route = createFileRoute("/admin/categorias")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const categories = await listAdminCategories();
    return { admin, categories };
  },
  component: AdminCategoriesPage,
});

type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; category: AdminCategoryRow };

function AdminCategoriesPage() {
  const { admin, categories } = Route.useLoaderData();
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todas" | "activas" | "inactivas" | "destacadas">("todas");

  const filtered = useMemo(
    () =>
      categories.filter((category: AdminCategoryRow) => {
        const text = `${category.name} ${category.slug} ${category.icon ?? ""}`.toLowerCase();
        const matchesText = text.includes(query.toLowerCase());
        const matchesFilter =
          filter === "todas" ||
          (filter === "activas" && category.is_active) ||
          (filter === "inactivas" && !category.is_active) ||
          (filter === "destacadas" && category.is_featured);
        return matchesText && matchesFilter;
      }),
    [categories, query, filter],
  );

  const stats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((c: AdminCategoryRow) => c.is_active).length,
      featured: categories.filter((c: AdminCategoryRow) => c.is_featured).length,
    }),
    [categories],
  );

  const toggleActive = async (category: AdminCategoryRow) => {
    try {
      await setAdminCategoryActive({
        data: { id: category.id, is_active: !category.is_active },
      });
      toast.success(category.is_active ? "Categoria desactivada" : "Categoria activada");
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo cambiar el estado."));
    }
  };

  const handleDelete = async (category: AdminCategoryRow) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Eliminar la categoria «${category.name}» definitivamente? Esta accion no se puede deshacer.`,
      )
    ) {
      return;
    }
    try {
      await deleteAdminCategory({ data: { id: category.id } });
      toast.success("Categoria eliminada");
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo eliminar la categoria."));
    }
  };

  return (
    <AdminLayout admin={admin}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-deep">Categorias</h1>
          <p className="text-sm text-slate-500">
            Crea y organiza las categorias que estructuran el catalogo publico.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-royal px-4 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nueva categoria
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total" value={stats.total} icon={FolderTree} />
        <StatCard label="Activas" value={stats.active} icon={FolderTree} tone="emerald" />
        <StatCard label="Destacadas" value={stats.featured} icon={Sparkles} tone="amber" />
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, slug o icono..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as typeof filter)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="todas">Todas</option>
          <option value="activas">Activas</option>
          <option value="inactivas">Inactivas</option>
          <option value="destacadas">Destacadas</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <FolderTree className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 font-display text-lg font-bold text-brand-deep">
            {categories.length === 0 ? "Todavia no hay categorias" : "No hay coincidencias"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {categories.length === 0
              ? "Crea tu primera categoria para empezar a organizar el catalogo."
              : "Probá cambiar los filtros o limpiá la busqueda."}
          </p>
          {categories.length === 0 && (
            <button
              type="button"
              onClick={() => setDialog({ mode: "create" })}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-royal px-4 py-2 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" /> Crear categoria
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((category: AdminCategoryRow) => {
            const Icon = resolveCategoryIcon(category.icon);
            return (
              <article
                key={category.id}
                className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-royal/40 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-soft text-brand-royal">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-brand-deep">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-500">/{category.slug}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tabular-nums text-slate-600">
                    #{category.sort_order ?? 0}
                  </span>
                </div>

                {category.description && (
                  <p className="line-clamp-2 text-sm text-slate-500">{category.description}</p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    label={category.is_active ? "Activa" : "Inactiva"}
                    tone={category.is_active ? "emerald" : "slate"}
                  />
                  {category.is_featured && <Badge label="Destacada" tone="amber" />}
                  {category.icon && (
                    <Badge label={`icon: ${category.icon}`} tone="slate" subtle />
                  )}
                </div>

                <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setDialog({ mode: "edit", category })}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(category)}
                    className={`inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-xs font-bold transition ${
                      category.is_active
                        ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                        : "bg-brand-royal text-white hover:opacity-90"
                    }`}
                  >
                    {category.is_active ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Eliminar ${category.name}`}
                    title="Eliminar definitivamente"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <CategoryDialog
        state={dialog}
        onClose={() => setDialog({ mode: "closed" })}
        onSaved={() => {
          setDialog({ mode: "closed" });
          router.invalidate();
        }}
      />
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "royal",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "royal" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700"
        : "bg-brand-soft text-brand-royal";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className={`grid h-10 w-10 place-items-center rounded-lg ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="font-display text-xl font-bold text-brand-deep">{value}</div>
      </div>
    </div>
  );
}

function Badge({
  label,
  tone,
  subtle,
}: {
  label: string;
  tone: "emerald" | "amber" | "slate";
  subtle?: boolean;
}) {
  const base = "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide";
  const colors = {
    emerald: subtle ? "bg-emerald-50 text-emerald-700" : "bg-emerald-100 text-emerald-700",
    amber: subtle ? "bg-amber-50 text-amber-700" : "bg-amber-100 text-amber-700",
    slate: subtle ? "bg-slate-50 text-slate-600" : "bg-slate-100 text-slate-600",
  };
  return <span className={`${base} ${colors[tone]}`}>{label}</span>;
}

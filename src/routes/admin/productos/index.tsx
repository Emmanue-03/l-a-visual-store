import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Edit3, Eye, EyeOff, Filter, Package, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ExportMenu } from "@/components/admin/ExportMenu";
import { ProductDialog, type ProductDialogState } from "@/components/admin/ProductDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/mock-data";
import { formatAdminError } from "@/lib/error-format";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminCategories } from "@/backend/admin-categories";
import {
  deleteAdminProduct,
  listAdminProducts,
  setAdminProductActive,
} from "@/backend/admin-products";
import { cn } from "@/lib/utils";

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
  head: () => ({ meta: [{ title: "Productos | L&A Multiventas" }] }),
});

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brandName: string;
  categoryName: string;
  imageUrl: string;
  price: number;
  stock: number;
  threshold: number;
  isActive: boolean;
  raw: unknown;
};

function AdminProducts() {
  const { admin, products, categories } = Route.useLoaderData();
  const [filter, setFilter] = useState<"todos" | "activos" | "inactivos" | "stock-bajo" | "agotados">("todos");
  const [dialog, setDialog] = useState<ProductDialogState>({ mode: "closed" });
  const router = useRouter();

  const rows: ProductRow[] = useMemo(
    () =>
      products.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku ?? "—",
        brandName: p.badge ?? "—",
        categoryName: p.category_name ?? p.category_slug ?? "Sin categoría",
        imageUrl: p.image_url ?? "",
        price: p.price,
        stock: p.stock ?? 0,
        threshold: p.low_stock_threshold ?? 5,
        isActive: Boolean(p.is_active),
        raw: p,
      })),
    [products],
  );

  const toggleActive = async (row: ProductRow) => {
    try {
      await setAdminProductActive({ data: { id: row.id, is_active: !row.isActive } });
      toast.success(row.isActive ? "Producto desactivado" : "Producto activado");
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo cambiar el estado."));
    }
  };

  const handleDelete = async (row: ProductRow) => {
    try {
      await deleteAdminProduct({ data: { id: row.id } });
      toast.success("Producto eliminado");
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo eliminar el producto."));
    }
  };

  const filtered = useMemo(() =>
    rows.filter((r) => {
      if (filter === "activos") return r.isActive;
      if (filter === "inactivos") return !r.isActive;
      if (filter === "stock-bajo") return r.stock > 0 && r.stock <= r.threshold;
      if (filter === "agotados") return r.stock === 0;
      return true;
    }), [rows, filter]);

  const stats = {
    total: rows.length,
    active: rows.filter((r) => r.isActive).length,
    low: rows.filter((r) => r.stock > 0 && r.stock <= r.threshold).length,
    out: rows.filter((r) => r.stock === 0).length,
  };

  const columns: Column<ProductRow>[] = [
    {
      key: "product",
      header: "Producto",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-mg-line bg-mg-night">
            {r.imageUrl ? (
              <img src={r.imageUrl} alt={r.name} className="h-full w-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2"; }} />
            ) : (
              <Package className="m-auto h-5 w-5 text-mg-muted" />
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate font-bold text-mg-text">{r.name}</div>
            <div className="truncate text-xs text-mg-muted">{r.slug}</div>
          </div>
        </div>
      ),
    },
    { key: "sku", header: "SKU", render: (r) => <code className="font-mono text-xs text-mg-gold-soft">{r.sku}</code> },
    { key: "brand", header: "Marca", render: (r) => <span className="text-sm text-mg-text/85">{r.brandName}</span> },
    { key: "category", header: "Categoría", render: (r) => <span className="text-sm text-mg-text/85 capitalize">{r.categoryName}</span> },
    {
      key: "stock",
      header: "Stock",
      align: "center",
      render: (r) => {
        if (r.stock === 0) return <span className="inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-300">Agotado</span>;
        if (r.stock <= r.threshold) return <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-300">{r.stock} u</span>;
        return <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-300">{r.stock} u</span>;
      },
    },
    { key: "price", header: "Precio", align: "right", render: (r) => <span className="font-display font-bold text-mg-gold-soft">{formatPrice(r.price)}</span> },
    {
      key: "status",
      header: "Estado",
      align: "center",
      render: (r) => r.isActive
        ? <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">Activo</span>
        : <span className="inline-flex rounded-full border border-mg-line bg-mg-night/50 px-2 py-0.5 text-[10px] font-bold uppercase text-mg-muted">Inactivo</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      render: (r) => (
        <div className="inline-flex items-center gap-1">
          <button
            onClick={() => setDialog({ mode: "edit", product: r.raw as any })}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line text-mg-muted hover:border-mg-magenta/50 hover:text-mg-pink"
            aria-label="Editar"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => toggleActive(r)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line text-mg-muted hover:border-mg-magenta/50 hover:text-mg-pink"
            aria-label={r.isActive ? "Desactivar" : "Activar"}
            title={r.isActive ? "Desactivar" : "Activar"}
          >
            {r.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <ConfirmDialog
            trigger={
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line text-mg-muted hover:border-rose-400/50 hover:text-rose-300">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            }
            title="Eliminar producto"
            description={<>¿Eliminar <strong className="text-mg-text">«{r.name}»</strong> definitivamente?</>}
            onConfirm={() => handleDelete(r)}
          />
        </div>
      ),
    },
  ];

  const exportRows = filtered.map((r) => ({
    SKU: r.sku, Producto: r.name, Marca: r.brandName, Categoría: r.categoryName,
    Stock: r.stock, "Precio (Gs)": r.price, Estado: r.isActive ? "Activo" : "Inactivo",
  }));

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Productos"
        description="Catálogo conectado a tu base de datos"
        icon={<Package className="h-5 w-5" />}
        actions={
          <>
            <ExportMenu filename="la-productos" rows={exportRows} />
            <Button onClick={() => setDialog({ mode: "create" })} className="bg-mg-magenta-gradient text-white shadow-mg-glow hover:opacity-95">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo producto
            </Button>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Mini label="Total" value={stats.total} />
        <Mini label="Activos" value={stats.active} tone="emerald" />
        <Mini label="Stock bajo" value={stats.low} tone="amber" />
        <Mini label="Agotados" value={stats.out} tone="rose" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-mg-muted" />
        {([
          { k: "todos" as const, l: "Todos" },
          { k: "activos" as const, l: "Activos" },
          { k: "inactivos" as const, l: "Inactivos" },
          { k: "stock-bajo" as const, l: "Stock bajo" },
          { k: "agotados" as const, l: "Agotados" },
        ]).map(({ k, l }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-bold transition",
              filter === k
                ? "border-mg-magenta bg-mg-magenta-gradient text-white shadow-mg-glow"
                : "border-mg-line bg-mg-ink/60 text-mg-muted hover:border-mg-magenta/40 hover:text-mg-text",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["name", "sku", "brandName", "categoryName", "slug"]}
          searchPlaceholder="Buscar nombre, SKU, marca o categoría…"
          rowKey={(r) => r.id}
          pageSize={10}
        />
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

function Mini({ label, value, tone = "magenta" }: { label: string; value: number; tone?: "magenta" | "emerald" | "amber" | "rose" }) {
  const toneCls = {
    magenta: "text-mg-pink",
    emerald: "text-emerald-300",
    amber: "text-amber-300",
    rose: "text-rose-300",
  }[tone];
  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink/60 p-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-mg-muted">{label}</div>
      <div className={cn("mt-1 font-display text-3xl font-bold", toneCls)}>{value}</div>
    </div>
  );
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Boxes, Package, PackageSearch, Settings2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ExportMenu } from "@/components/admin/ExportMenu";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { listAdminProducts } from "@/backend/admin-products";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/inventario")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const products = await listAdminProducts();
    return { admin, products };
  },
  component: AdminInventory,
  head: () => ({ meta: [{ title: "Inventario | L&A Multiventas" }] }),
});

type Row = {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  imageUrl: string;
  stock: number;
  threshold: number;
  price: number;
  isActive: boolean;
};

function AdminInventory() {
  const { admin, products } = Route.useLoaderData();
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const rows: Row[] = useMemo(
    () =>
      products.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku ?? "—",
        categoryName: p.category_name ?? "Sin categoría",
        imageUrl: p.image_url ?? "",
        stock: p.stock ?? 0,
        threshold: p.low_stock_threshold ?? 5,
        price: p.price,
        isActive: Boolean(p.is_active),
      })),
    [products],
  );

  const stats = useMemo(() => {
    const totalUnits = rows.reduce((s, r) => s + r.stock, 0);
    const lowCount = rows.filter((r) => r.stock > 0 && r.stock <= r.threshold).length;
    const outCount = rows.filter((r) => r.stock === 0).length;
    const value = rows.reduce((s, r) => s + r.stock * r.price, 0);
    return { totalUnits, lowCount, outCount, value };
  }, [rows]);

  const filtered = useMemo(() => {
    if (filter === "low") return rows.filter((r) => r.stock > 0 && r.stock <= r.threshold);
    if (filter === "out") return rows.filter((r) => r.stock === 0);
    return rows;
  }, [filter, rows]);

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "Producto",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.imageUrl ? (
            <img src={r.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-mg-line" />
          ) : (
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-mg-ink-soft text-mg-muted">
              <Package className="h-4 w-4" />
            </div>
          )}
          <div>
            <div className="font-bold text-mg-text">{r.name}</div>
            <div className="text-xs text-mg-muted">{r.categoryName}</div>
          </div>
        </div>
      ),
    },
    { key: "sku", header: "SKU", render: (r) => <code className="font-mono text-xs text-[color:var(--mg-gold-deep)]">{r.sku}</code> },
    {
      key: "stock",
      header: "Stock",
      align: "center",
      render: (r) => <StockBadge stock={r.stock} threshold={r.threshold} />,
    },
    { key: "threshold", header: "Umbral", align: "center", render: (r) => <span className="text-sm text-mg-muted">{r.threshold}</span> },
    {
      key: "value",
      header: "Valor estimado",
      align: "right",
      render: (r) => <span className="font-display font-bold text-[color:var(--mg-gold-deep)]">{formatPrice(r.stock * r.price)}</span>,
    },
  ];

  const exportRows = filtered.map((r) => ({
    SKU: r.sku,
    Producto: r.name,
    Categoría: r.categoryName,
    Stock: r.stock,
    Umbral: r.threshold,
    "Valor (Gs)": r.stock * r.price,
  }));

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Inventario"
        description="Stock actual de productos según el catálogo en base de datos."
        icon={<PackageSearch className="h-5 w-5" />}
        actions={<ExportMenu filename="la-inventario" rows={exportRows} />}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Mini label="Unidades en stock" value={stats.totalUnits.toLocaleString("es-PY")} icon={Boxes} />
        <Mini label="Stock bajo" value={String(stats.lowCount)} icon={AlertTriangle} tone="amber" />
        <Mini label="Agotados" value={String(stats.outCount)} icon={AlertTriangle} tone="rose" />
        <Mini label="Valor estimado" value={formatPrice(stats.value)} icon={Settings2} tone="gold" />
      </div>

      {(stats.outCount > 0 || stats.lowCount > 0) && (
        <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <h4 className="font-bold text-amber-700 dark:text-amber-200">Alertas de inventario</h4>
            <p className="mt-0.5 text-sm text-amber-700/80 dark:text-amber-100/80">
              Tenés <strong>{stats.outCount}</strong> agotado{stats.outCount !== 1 ? "s" : ""} y{" "}
              <strong>{stats.lowCount}</strong> con stock bajo. Editá el producto desde el listado para reponer.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {([
          { k: "all" as const, l: `Todos (${rows.length})` },
          { k: "low" as const, l: `Stock bajo (${stats.lowCount})` },
          { k: "out" as const, l: `Agotados (${stats.outCount})` },
        ]).map(({ k, l }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition",
              filter === k
                ? "border-[color:var(--mg-magenta)] bg-mg-magenta-gradient text-white shadow-mg-glow"
                : "border-mg-line bg-mg-ink text-mg-muted hover:border-[color:var(--mg-magenta)]/40 hover:text-mg-text",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["name", "sku", "categoryName"]}
          searchPlaceholder="Buscar por nombre, SKU o categoría…"
          rowKey={(r) => r.id}
          pageSize={12}
        />
      </div>
    </AdminLayout>
  );
}

function Mini({
  label,
  value,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "blue" | "amber" | "rose" | "gold";
}) {
  const toneCls = {
    blue: "bg-[color:var(--mg-magenta)]/10 text-[color:var(--mg-magenta)] ring-[color:var(--mg-magenta)]/30",
    amber: "bg-amber-500/10 text-amber-600 ring-amber-400/40",
    rose: "bg-rose-500/10 text-rose-600 ring-rose-400/40",
    gold: "bg-[color:var(--mg-gold)]/15 text-[color:var(--mg-gold-deep)] ring-[color:var(--mg-gold)]/40",
  }[tone];
  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-mg-muted">{label}</div>
          <div className="mt-2 font-display text-2xl font-bold text-mg-text">{value}</div>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${toneCls}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock === 0) {
    return <span className="inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-300">Agotado</span>;
  }
  if (stock <= threshold) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-300">
        <AlertTriangle className="h-3 w-3" /> {stock} u
      </span>
    );
  }
  return <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-300">{stock} u</span>;
}

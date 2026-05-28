import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Edit3, Percent, Plus, Tag, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ExportMenu } from "@/components/admin/ExportMenu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { formatDate, formatGs, formatNumber, mockCoupons, type MockCoupon } from "@/lib/admin-mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/cupones")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    return { admin };
  },
  component: AdminCoupons,
  head: () => ({ meta: [{ title: "Cupones | M&G Perfumería" }] }),
});

function AdminCoupons() {
  const { admin } = Route.useLoaderData();
  const [coupons, setCoupons] = useState<MockCoupon[]>(mockCoupons);

  const deleteCoupon = (c: MockCoupon) => {
    setCoupons((prev) => prev.filter((x) => x.id !== c.id));
    toast.success(`Cupón ${c.code} eliminado`);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => toast.success(`Código ${code} copiado`));
  };

  const totals = {
    active: coupons.filter((c) => c.isActive).length,
    totalUses: coupons.reduce((s, c) => s + c.uses, 0),
    savings: coupons.reduce((s, c) => s + (c.type === "fixed" ? c.value * c.uses : 50_000 * c.uses), 0),
  };

  const columns: Column<MockCoupon>[] = [
    {
      key: "code",
      header: "Código",
      render: (c) => (
        <div className="flex items-center gap-2">
          <code className="rounded-lg border border-mg-gold/40 bg-mg-gold/10 px-2 py-1 font-mono text-sm font-bold text-mg-gold-soft">{c.code}</code>
          <button onClick={() => copyCode(c.code)} className="text-mg-muted hover:text-mg-pink" title="Copiar">
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
    {
      key: "description",
      header: "Descripción",
      render: (c) => (
        <div>
          <div className="font-semibold text-mg-text">{c.description}</div>
          {c.minPurchase > 0 && <div className="text-xs text-mg-muted">Mínimo: {formatGs(c.minPurchase)}</div>}
        </div>
      ),
    },
    {
      key: "value",
      header: "Descuento",
      align: "center",
      render: (c) => (
        <span className="inline-flex items-center gap-1 rounded-full border border-mg-magenta/35 bg-mg-magenta/15 px-2.5 py-0.5 text-xs font-bold text-mg-pink">
          {c.type === "percent" ? <><Percent className="h-3 w-3" />{c.value}</> : `Gs ${formatNumber(c.value)}`}
        </span>
      ),
    },
    {
      key: "uses",
      header: "Uso",
      render: (c) => {
        const pct = c.maxUses > 0 ? Math.round((c.uses / c.maxUses) * 100) : 0;
        return (
          <div className="w-32">
            <div className="flex justify-between text-[10px] text-mg-muted">
              <span>{formatNumber(c.uses)}/{formatNumber(c.maxUses)}</span>
              <span className="font-bold">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-1 h-1.5 bg-mg-night [&>div]:bg-mg-magenta-gradient" />
          </div>
        );
      },
    },
    {
      key: "expiresAt",
      header: "Vigencia",
      render: (c) => (
        <div className="text-xs">
          <div className="text-mg-text/80">{formatDate(c.startsAt)}</div>
          <div className="text-mg-muted">hasta {formatDate(c.expiresAt)}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Estado",
      align: "center",
      render: (c) => (
        <span className={cn(
          "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
          c.isActive
            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
            : "border-mg-line bg-mg-night/50 text-mg-muted",
        )}>
          {c.isActive ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (c) => (
        <div className="inline-flex gap-1">
          <button onClick={() => toast.info("Edición en desarrollo")} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line text-mg-muted hover:border-mg-magenta/50 hover:text-mg-pink">
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <ConfirmDialog
            trigger={
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line text-mg-muted hover:border-rose-400/50 hover:text-rose-300">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            }
            title="Eliminar cupón"
            description={<>¿Eliminar el cupón <code className="font-mono font-bold text-mg-gold-soft">{c.code}</code>?</>}
            confirmLabel="Eliminar"
            onConfirm={() => deleteCoupon(c)}
          />
        </div>
      ),
    },
  ];

  const exportRows = coupons.map((c) => ({
    Código: c.code,
    Descripción: c.description,
    Tipo: c.type === "percent" ? "Porcentaje" : "Fijo",
    Valor: c.value,
    "Compra mínima": c.minPurchase,
    Usos: c.uses,
    "Usos máx.": c.maxUses,
    Inicio: c.startsAt,
    Expira: c.expiresAt,
    Activo: c.isActive ? "Sí" : "No",
  }));

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Cupones"
        description="Códigos promocionales activos y vencidos."
        icon={<TicketPercent className="h-5 w-5" />}
        actions={
          <>
            <ExportMenu filename="mg-cupones" rows={exportRows} />
            <Button onClick={() => toast.info("Creación de cupón en desarrollo")} className="bg-mg-magenta-gradient text-white shadow-mg-glow hover:opacity-95">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo cupón
            </Button>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Summary label="Cupones activos" value={formatNumber(totals.active)} icon={<Tag className="h-4 w-4" />} />
        <Summary label="Usos totales" value={formatNumber(totals.totalUses)} icon={<TicketPercent className="h-4 w-4" />} />
        <Summary label="Ahorro generado" value={formatGs(totals.savings)} icon={<Percent className="h-4 w-4" />} accent="gold" />
      </div>

      <div className="mt-6">
        <DataTable
          data={coupons}
          columns={columns}
          searchKeys={["code", "description"]}
          searchPlaceholder="Buscar por código o descripción…"
          rowKey={(c) => c.id}
          pageSize={10}
        />
      </div>
    </AdminLayout>
  );
}

function Summary({ label, value, icon, accent = "magenta" }: { label: string; value: string; icon: React.ReactNode; accent?: "magenta" | "gold" }) {
  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink/60 p-5">
      <div className="flex items-center gap-3">
        <div className={cn(
          "grid h-10 w-10 place-items-center rounded-xl text-white",
          accent === "gold" ? "bg-mg-gold-gradient shadow-mg-gold" : "bg-mg-magenta-gradient shadow-mg-glow",
        )}>
          {icon}
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-mg-muted">{label}</div>
          <div className="font-display text-xl font-bold text-mg-text">{value}</div>
        </div>
      </div>
    </div>
  );
}

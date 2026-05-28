import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Crown, Eye, Mail, MapPin, Phone, ShoppingBag, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { TierBadge } from "@/components/admin/StatusBadge";
import { ExportMenu } from "@/components/admin/ExportMenu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCurrentAdmin } from "@/backend/admin-auth";
import {
  formatDate,
  formatGs,
  formatNumber,
  mockCustomers,
  mockOrders,
  type MockCustomer,
  type MockCustomerTier,
} from "@/lib/admin-mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/clientes")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    return { admin };
  },
  component: AdminCustomers,
  head: () => ({ meta: [{ title: "Clientes | M&G Perfumería" }] }),
});

const tierFilters: ("all" | MockCustomerTier)[] = ["all", "platinum", "gold", "silver", "bronze"];

function AdminCustomers() {
  const { admin } = Route.useLoaderData();
  const [tier, setTier] = useState<(typeof tierFilters)[number]>("all");
  const [selected, setSelected] = useState<MockCustomer | null>(null);

  const filteredCustomers = useMemo(
    () => tier === "all" ? mockCustomers : mockCustomers.filter((c) => c.tier === tier),
    [tier],
  );

  const totals = useMemo(() => ({
    customers: mockCustomers.length,
    platinum: mockCustomers.filter((c) => c.tier === "platinum").length,
    revenue: mockCustomers.reduce((s, c) => s + c.totalSpent, 0),
    activeThisMonth: mockCustomers.filter((c) => c.lastOrderAt && c.lastOrderAt.startsWith("2026-05")).length,
  }), []);

  const columns: Column<MockCustomer>[] = [
    {
      key: "customer",
      header: "Cliente",
      render: (c) => (
        <div className="flex items-center gap-3">
          <img src={c.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-mg-line" />
          <div>
            <div className="font-bold text-mg-text">{c.fullName}</div>
            <div className="text-xs text-mg-muted">{c.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "tier",
      header: "Nivel",
      render: (c) => <TierBadge tier={c.tier} />,
    },
    { key: "city", header: "Ciudad", render: (c) => <span className="text-sm text-mg-text/80">{c.city}</span> },
    { key: "totalOrders", header: "Pedidos", align: "right", render: (c) => <span className="font-mono font-bold text-mg-text">{c.totalOrders}</span> },
    { key: "totalSpent", header: "Total gastado", align: "right", render: (c) => <span className="font-display font-bold text-mg-gold-soft">{formatGs(c.totalSpent)}</span> },
    { key: "lastOrderAt", header: "Última compra", render: (c) => <span className="text-sm text-mg-muted">{formatDate(c.lastOrderAt)}</span> },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      render: (c) => (
        <button onClick={() => setSelected(c)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-mg-line px-2.5 text-xs font-bold text-mg-text hover:border-mg-magenta/50 hover:text-mg-pink">
          <Eye className="h-3.5 w-3.5" /> Ver
        </button>
      ),
    },
  ];

  const exportRows = filteredCustomers.map((c) => ({
    Nombre: c.fullName,
    Email: c.email,
    Teléfono: c.phone,
    Ciudad: c.city,
    Nivel: c.tier,
    Pedidos: c.totalOrders,
    "Total gastado (Gs)": c.totalSpent,
    "Última compra": c.lastOrderAt ?? "—",
  }));

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Clientes"
        description="Base de clientes con historial, gasto acumulado y nivel."
        icon={<Users className="h-5 w-5" />}
        actions={<ExportMenu filename="mg-clientes" rows={exportRows} />}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total clientes" value={formatNumber(totals.customers)} />
        <SummaryCard label="Clientes Platinum" value={formatNumber(totals.platinum)} />
        <SummaryCard label="Activos este mes" value={formatNumber(totals.activeThisMonth)} />
        <SummaryCard label="Revenue total" value={formatGs(totals.revenue)} />
      </div>

      {/* Tier filter chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tierFilters.map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition",
              tier === t
                ? "border-mg-magenta bg-mg-magenta-gradient text-white shadow-mg-glow"
                : "border-mg-line bg-mg-ink/60 text-mg-muted hover:border-mg-magenta/40 hover:text-mg-text",
            )}
          >
            {t === "all" ? "Todos" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <DataTable
          data={filteredCustomers}
          columns={columns}
          searchKeys={["fullName", "email", "phone", "city"]}
          searchPlaceholder="Buscar cliente…"
          rowKey={(c) => c.id}
          pageSize={10}
        />
      </div>

      {/* Customer detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="border-mg-line bg-mg-ink text-mg-text sm:max-w-2xl">
          {selected && <CustomerDetail customer={selected} />}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink/60 p-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-mg-muted">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold text-mg-text">{value}</div>
    </div>
  );
}

function CustomerDetail({ customer }: { customer: MockCustomer }) {
  const orders = mockOrders.filter((o) => o.customerId === customer.id);
  const totalThisYear = orders.reduce((s, o) => s + o.total, 0);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-4">
          <img src={customer.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-mg-magenta/40" />
          <div>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              {customer.fullName}
              <TierBadge tier={customer.tier} />
              {customer.tier === "platinum" && <Crown className="h-4 w-4 text-mg-gold" />}
            </DialogTitle>
            <DialogDescription className="text-mg-muted">
              Cliente desde {formatDate(customer.joinedAt)}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <DetailStat label="Pedidos" value={formatNumber(customer.totalOrders)} />
        <DetailStat label="Total gastado" value={formatGs(customer.totalSpent)} />
        <DetailStat label="Última compra" value={formatDate(customer.lastOrderAt)} />
      </div>

      <div className="grid gap-2 rounded-xl border border-mg-line bg-mg-night/50 p-4 text-sm">
        <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={customer.email} />
        <Row icon={<Phone className="h-3.5 w-3.5" />} label="Teléfono" value={customer.phone} />
        <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Ubicación" value={`${customer.city}, ${customer.country}`} />
      </div>

      <div>
        <h4 className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-mg-muted">
          <ShoppingBag className="h-4 w-4" /> Últimos pedidos
        </h4>
        <div className="rounded-xl border border-mg-line bg-mg-night/50 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-6 text-center text-sm text-mg-muted">Sin pedidos registrados.</div>
          ) : orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b border-mg-line/60 px-4 py-2.5 last:border-0">
              <div>
                <div className="font-mono text-sm font-bold text-mg-pink">{o.number}</div>
                <div className="text-xs text-mg-muted">{formatDate(o.createdAt)} · {o.status}</div>
              </div>
              <div className="font-display font-bold text-mg-gold-soft">{formatGs(o.total)}</div>
            </div>
          ))}
          {orders.length > 0 && (
            <div className="border-t border-mg-line bg-mg-magenta/10 px-4 py-2 text-xs">
              <span className="text-mg-muted">Total en período: </span>
              <strong className="font-display text-mg-gold-soft">{formatGs(totalThisYear)}</strong>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-mg-line bg-mg-night/50 p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-mg-muted">{label}</div>
      <div className="mt-1 font-display text-lg font-bold text-mg-text">{value}</div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-mg-muted">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <span className="font-bold text-mg-text">{value}</span>
    </div>
  );
}

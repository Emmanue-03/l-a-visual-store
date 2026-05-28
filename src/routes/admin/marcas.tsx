import { createFileRoute, redirect } from "@tanstack/react-router";
import { Gem, Plus, Edit3, Trash2, Star, Globe2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ExportMenu } from "@/components/admin/ExportMenu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { formatGs, formatNumber, mockBrands, type MockBrand } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/marcas")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    return { admin };
  },
  component: AdminBrands,
  head: () => ({ meta: [{ title: "Marcas | M&G Perfumería" }] }),
});

function AdminBrands() {
  const { admin } = Route.useLoaderData();
  const [brands, setBrands] = useState<MockBrand[]>(mockBrands);
  const [editing, setEditing] = useState<MockBrand | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openNew = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (b: MockBrand) => { setEditing(b); setDialogOpen(true); };

  const saveBrand = (data: Partial<MockBrand>) => {
    if (editing) {
      setBrands((prev) => prev.map((b) => b.id === editing.id ? { ...b, ...data } : b));
      toast.success("Marca actualizada");
    } else {
      const id = `br-${String(brands.length + 1).padStart(2, "0")}`;
      setBrands((prev) => [...prev, {
        id,
        name: data.name || "Nueva marca",
        slug: (data.name || "nueva").toLowerCase().replace(/\s+/g, "-"),
        country: data.country || "—",
        logoUrl: data.logoUrl || `https://i.pravatar.cc/120?u=${id}`,
        productsCount: 0,
        totalSales: 0,
        featured: data.featured ?? false,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString().slice(0, 10),
      }]);
      toast.success("Marca creada");
    }
    setDialogOpen(false);
  };

  const deleteBrand = (b: MockBrand) => {
    setBrands((prev) => prev.filter((x) => x.id !== b.id));
    toast.success(`Marca "${b.name}" eliminada`);
  };

  const columns: Column<MockBrand>[] = [
    {
      key: "name",
      header: "Marca",
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-mg-line bg-mg-night text-mg-gold-soft font-display font-bold">
            {b.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-mg-text">
              {b.name}
              {b.featured && <Star className="h-3.5 w-3.5 fill-mg-gold text-mg-gold" />}
            </div>
            <div className="text-xs text-mg-muted">/{b.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "country",
      header: "Origen",
      render: (b) => (
        <span className="inline-flex items-center gap-1.5 text-sm text-mg-text/80">
          <Globe2 className="h-3.5 w-3.5 text-mg-muted" />
          {b.country}
        </span>
      ),
    },
    { key: "productsCount", header: "Productos", align: "right", render: (b) => <span className="font-mono font-bold text-mg-text">{formatNumber(b.productsCount)}</span> },
    { key: "totalSales", header: "Ventas totales", align: "right", render: (b) => <span className="font-display font-bold text-mg-gold-soft">{formatGs(b.totalSales)}</span> },
    {
      key: "isActive",
      header: "Estado",
      align: "center",
      render: (b) => b.isActive
        ? <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">Activa</span>
        : <span className="inline-flex rounded-full border border-mg-line bg-mg-night/50 px-2 py-0.5 text-[10px] font-bold uppercase text-mg-muted">Pausada</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      render: (b) => (
        <div className="inline-flex items-center gap-1">
          <button onClick={() => openEdit(b)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line text-mg-muted hover:border-mg-magenta/50 hover:text-mg-pink">
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <ConfirmDialog
            trigger={
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line text-mg-muted hover:border-rose-400/50 hover:text-rose-300">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            }
            title="Eliminar marca"
            description={<>¿Eliminar <strong className="text-mg-text">{b.name}</strong>? Esta acción no se puede deshacer.</>}
            confirmLabel="Sí, eliminar"
            onConfirm={() => deleteBrand(b)}
          />
        </div>
      ),
    },
  ];

  const exportRows = brands.map((b) => ({
    Marca: b.name,
    Origen: b.country,
    Productos: b.productsCount,
    "Ventas (Gs)": b.totalSales,
    Estado: b.isActive ? "Activa" : "Pausada",
    Destacada: b.featured ? "Sí" : "No",
    Creada: b.createdAt,
  }));

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Marcas"
        description="Gestioná las casas de perfumería que vendés."
        icon={<Gem className="h-5 w-5" />}
        actions={
          <>
            <ExportMenu filename="mg-marcas" rows={exportRows} />
            <Button onClick={openNew} className="bg-mg-magenta-gradient text-white shadow-mg-glow hover:opacity-95">
              <Plus className="mr-2 h-4 w-4" />
              Nueva marca
            </Button>
          </>
        }
      />

      {/* Resumen */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Marcas activas" value={brands.filter((b) => b.isActive).length} />
        <SummaryCard label="Destacadas" value={brands.filter((b) => b.featured).length} />
        <SummaryCard label="Productos totales" value={brands.reduce((s, b) => s + b.productsCount, 0)} />
        <SummaryCard label="Ventas acumuladas" value={formatGs(brands.reduce((s, b) => s + b.totalSales, 0))} currency />
      </div>

      <div className="mt-6">
        <DataTable
          data={brands}
          columns={columns}
          searchKeys={["name", "country", "slug"]}
          searchPlaceholder="Buscar por nombre, país o slug…"
          rowKey={(b) => b.id}
          pageSize={8}
        />
      </div>

      <BrandDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        brand={editing}
        onSave={saveBrand}
      />
    </AdminLayout>
  );
}

function SummaryCard({ label, value, currency }: { label: string; value: number | string; currency?: boolean }) {
  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink/60 p-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-mg-muted">{label}</div>
      <div className={`mt-1 font-display ${currency ? "text-xl" : "text-3xl"} font-bold text-mg-text`}>{value}</div>
    </div>
  );
}

function BrandDialog({
  open,
  onOpenChange,
  brand,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  brand: MockBrand | null;
  onSave: (data: Partial<MockBrand>) => void;
}) {
  const [name, setName] = useState(brand?.name ?? "");
  const [country, setCountry] = useState(brand?.country ?? "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl ?? "");
  const [featured, setFeatured] = useState(brand?.featured ?? false);
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);

  // Reset form when dialog opens with different brand
  if (open && brand && brand.name !== name && country !== brand.country) {
    setName(brand.name);
    setCountry(brand.country);
    setLogoUrl(brand.logoUrl);
    setFeatured(brand.featured);
    setIsActive(brand.isActive);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-mg-line bg-mg-ink text-mg-text sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{brand ? "Editar marca" : "Nueva marca"}</DialogTitle>
          <DialogDescription className="text-mg-muted">
            Las marcas aparecen filtrando productos en la tienda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="brand-name">Nombre</Label>
            <Input id="brand-name" value={name} onChange={(e) => setName(e.target.value)} className="border-mg-line bg-mg-night/70 text-mg-text" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="brand-country">País de origen</Label>
            <Input id="brand-country" value={country} onChange={(e) => setCountry(e.target.value)} className="border-mg-line bg-mg-night/70 text-mg-text" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="brand-logo">URL del logo</Label>
            <Textarea id="brand-logo" rows={2} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="border-mg-line bg-mg-night/70 text-mg-text" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-mg-line bg-mg-night/40 px-4 py-3">
            <div>
              <Label htmlFor="featured" className="text-sm font-bold">Destacada</Label>
              <p className="text-xs text-mg-muted">Aparece en la home pública.</p>
            </div>
            <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-mg-line bg-mg-night/40 px-4 py-3">
            <div>
              <Label htmlFor="active" className="text-sm font-bold">Activa</Label>
              <p className="text-xs text-mg-muted">Si está pausada, no se muestra en el catálogo.</p>
            </div>
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-mg-line bg-mg-night/60 text-mg-text">
            Cancelar
          </Button>
          <Button
            onClick={() => onSave({ name, country, logoUrl, featured, isActive })}
            className="bg-mg-magenta-gradient text-white shadow-mg-glow hover:opacity-95"
          >
            {brand ? "Guardar cambios" : "Crear marca"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { getAdminSettings, saveAdminSettings } from "@/backend/admin-store";
import { formatAdminError } from "@/lib/error-format";

export const Route = createFileRoute("/admin/configuracion")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const settings = await getAdminSettings();
    return { admin, settings };
  },
  component: AdminSettings,
  head: () => ({ meta: [{ title: "Configuración | L&A Multiventas" }] }),
});

function AdminSettings() {
  const { admin, settings } = Route.useLoaderData();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    try {
      await saveAdminSettings({
        data: {
          storeName: String(form.get("storeName") ?? ""),
          whatsappPhone: String(form.get("whatsappPhone") ?? ""),
          currency: String(form.get("currency") ?? "PYG"),
          defaultShippingCost: Number(form.get("defaultShippingCost") || 0),
          seoTitle: String(form.get("seoTitle") || ""),
          seoDescription: String(form.get("seoDescription") || ""),
        },
      });
      toast.success("Configuración guardada");
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo guardar."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Configuración"
        description="Datos de la tienda, WhatsApp y SEO."
        icon={<Settings className="h-5 w-5" />}
      />

      <form onSubmit={submit} className="mt-6 max-w-3xl space-y-4 rounded-2xl border border-mg-line bg-mg-ink p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre de tienda" name="storeName" defaultValue={settings.storeName} />
          <Field label="Teléfono WhatsApp" name="whatsappPhone" defaultValue={settings.whatsappPhone} />
          <Field label="Moneda" name="currency" defaultValue={settings.currency} />
          <Field label="Costo envío default (Gs)" name="defaultShippingCost" type="number" defaultValue={settings.defaultShippingCost} />
        </div>
        <Field label="SEO title" name="seoTitle" defaultValue={settings.seoTitle ?? ""} />
        <label className="block text-sm font-semibold text-mg-text">
          SEO description
          <textarea
            name="seoDescription"
            defaultValue={settings.seoDescription ?? ""}
            rows={4}
            className="mt-1 w-full rounded-lg border border-mg-line bg-mg-ink-soft px-3 py-2 text-sm text-mg-text"
          />
        </label>
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-mg-magenta-gradient text-white shadow-mg-glow hover:opacity-95">
            {saving ? "Guardando…" : "Guardar configuración"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field(props: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="block text-sm font-semibold text-mg-text">
      {label}
      <input
        {...inputProps}
        className="mt-1 w-full rounded-lg border border-mg-line bg-mg-ink-soft px-3 py-2 text-sm text-mg-text"
      />
    </label>
  );
}

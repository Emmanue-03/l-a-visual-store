import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCurrentAdmin } from "@/backend/admin-auth";
import { getAdminSettings, saveAdminSettings } from "@/backend/admin-store";

export const Route = createFileRoute("/admin/configuracion")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const settings = await getAdminSettings();
    return { admin, settings };
  },
  component: AdminSettings,
});

function AdminSettings() {
  const { admin, settings } = Route.useLoaderData();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    await saveAdminSettings({
      data: {
        storeName: String(form.get("storeName") ?? ""),
        whatsappPhone: String(form.get("whatsappPhone") ?? ""),
        currency: String(form.get("currency") ?? "PYG"),
        defaultShippingCost: Number(form.get("defaultShippingCost") || 0),
        seoTitle: String(form.get("seoTitle") || ""),
        seoDescription: String(form.get("seoDescription") || ""),
      },
    }).finally(() => setSaving(false));
    toast.success("Configuracion guardada");
    router.invalidate();
  };

  return (
    <AdminLayout admin={admin}>
      <h1 className="font-display text-2xl font-bold text-brand-deep">Configuracion</h1>
      <p className="text-sm text-slate-500">Datos basicos de tienda, WhatsApp y SEO.</p>

      <form onSubmit={submit} className="mt-5 max-w-3xl space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <Field label="Nombre de tienda" name="storeName" defaultValue={settings.storeName} />
        <Field label="Telefono WhatsApp" name="whatsappPhone" defaultValue={settings.whatsappPhone} />
        <Field label="Moneda" name="currency" defaultValue={settings.currency} />
        <Field label="Costo envio default" name="defaultShippingCost" type="number" defaultValue={settings.defaultShippingCost} />
        <Field label="SEO title" name="seoTitle" defaultValue={settings.seoTitle ?? ""} />
        <label className="block text-sm font-semibold text-slate-700">
          SEO description
          <textarea name="seoDescription" defaultValue={settings.seoDescription ?? ""} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </label>
        <button disabled={saving} className="rounded-lg bg-brand-royal px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
          {saving ? "Guardando..." : "Guardar configuracion"}
        </button>
      </form>
    </AdminLayout>
  );
}

function Field(props: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input {...inputProps} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
    </label>
  );
}


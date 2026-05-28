import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Plus, ShieldCheck, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCurrentAdmin } from "@/backend/admin-auth";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminUser,
  type AdminUserPublic,
} from "@/backend/admin-users";
import { formatAdminError } from "@/lib/error-format";

export const Route = createFileRoute("/admin/usuarios")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (!admin) throw redirect({ to: "/admin/login" });
    const users = await listAdminUsers();
    return { admin, users };
  },
  component: AdminUsers,
  head: () => ({ meta: [{ title: "Usuarios admin | L&A Multiventas" }] }),
});

function formatDateTime(value: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("es-PY");
  } catch {
    return value;
  }
}

function AdminUsers() {
  const { admin, users } = Route.useLoaderData();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggleActive = async (u: AdminUserPublic) => {
    try {
      await updateAdminUser({ data: { id: u.id, is_active: !u.isActive } });
      toast.success(`Usuario ${u.fullName ?? u.email} ${u.isActive ? "desactivado" : "activado"}`);
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo actualizar."));
    }
  };

  const deleteUser = async (u: AdminUserPublic) => {
    try {
      await deleteAdminUser({ data: { id: u.id } });
      toast.success("Usuario eliminado");
      router.invalidate();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo eliminar."));
    }
  };

  const columns: Column<AdminUserPublic>[] = [
    {
      key: "user",
      header: "Usuario",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-mg-magenta-gradient text-xs font-bold text-white">
            {(u.fullName || u.email).slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-mg-text">{u.fullName ?? "(sin nombre)"}</div>
            <div className="text-xs text-mg-muted">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rol",
      render: (u) => (
        <span className="inline-flex rounded-full border border-mg-line bg-mg-ink-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mg-text">
          {u.role}
        </span>
      ),
    },
    { key: "lastLogin", header: "Último acceso", render: (u) => <span className="text-sm text-mg-text/85">{formatDateTime(u.lastLoginAt)}</span> },
    { key: "createdAt", header: "Creado", render: (u) => <span className="text-sm text-mg-muted">{formatDateTime(u.createdAt)}</span> },
    {
      key: "isActive",
      header: "Activo",
      align: "center",
      render: (u) => <Switch checked={u.isActive} onCheckedChange={() => toggleActive(u)} disabled={u.id === admin.id} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) => (
        <ConfirmDialog
          trigger={
            <button
              disabled={u.id === admin.id}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line text-mg-muted hover:border-rose-400/50 hover:text-rose-500 disabled:opacity-30"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          }
          title="Eliminar usuario administrador"
          description={<>¿Eliminar a <strong>{u.fullName ?? u.email}</strong>? Perderá acceso al panel.</>}
          onConfirm={() => deleteUser(u)}
        />
      ),
    },
  ];

  return (
    <AdminLayout admin={admin}>
      <PageHeader
        title="Usuarios administradores"
        description="Equipo con acceso al panel L&A."
        icon={<ShieldCheck className="h-5 w-5" />}
        actions={
          <Button onClick={() => setOpen(true)} className="bg-mg-magenta-gradient text-white shadow-mg-glow hover:opacity-95">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo usuario
          </Button>
        }
      />

      <div className="mt-6">
        <DataTable
          data={users}
          columns={columns}
          searchKeys={["fullName", "email"]}
          searchPlaceholder="Buscar usuario…"
          rowKey={(u) => u.id}
          pageSize={10}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-mg-line bg-mg-ink p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--mg-gold)]/15 text-[color:var(--mg-gold-deep)] ring-1 ring-[color:var(--mg-gold)]/40">
            <UserCog className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-mg-text">Niveles de permiso</h3>
            <ul className="mt-2 grid gap-1.5 text-sm text-mg-muted sm:grid-cols-2">
              <li><strong className="text-[color:var(--mg-magenta)]">Admin</strong> · acceso completo al panel</li>
              <li><strong className="text-[color:var(--mg-gold-deep)]">Editor</strong> · gestiona catálogo y pedidos</li>
            </ul>
          </div>
        </div>
      </div>

      <NewUserDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          setOpen(false);
          router.invalidate();
        }}
      />
    </AdminLayout>
  );
}

function NewUserDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    try {
      await createAdminUser({
        data: {
          email: String(form.get("email") ?? ""),
          full_name: String(form.get("full_name") ?? "") || null,
          password: String(form.get("password") ?? ""),
          role: (String(form.get("role") ?? "admin") as "admin" | "editor"),
          is_active: true,
        },
      });
      toast.success("Usuario creado");
      onCreated();
    } catch (error) {
      toast.error(formatAdminError(error, "No se pudo crear el usuario."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo usuario administrador</DialogTitle>
          <DialogDescription>El usuario podrá iniciar sesión en /admin/login con esta clave.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-semibold text-mg-text">
            Nombre completo
            <input name="full_name" className="mt-1 w-full rounded-lg border border-mg-line bg-mg-ink-soft px-3 py-2 text-sm text-mg-text" />
          </label>
          <label className="block text-sm font-semibold text-mg-text">
            Email
            <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-mg-line bg-mg-ink-soft px-3 py-2 text-sm text-mg-text" />
          </label>
          <label className="block text-sm font-semibold text-mg-text">
            Contraseña (mín 8)
            <input name="password" type="password" required minLength={8} className="mt-1 w-full rounded-lg border border-mg-line bg-mg-ink-soft px-3 py-2 text-sm text-mg-text" />
          </label>
          <label className="block text-sm font-semibold text-mg-text">
            Rol
            <select name="role" defaultValue="admin" className="mt-1 w-full rounded-lg border border-mg-line bg-mg-ink-soft px-3 py-2 text-sm text-mg-text">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </label>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving} className="bg-mg-magenta-gradient text-white">
              {saving ? "Guardando…" : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

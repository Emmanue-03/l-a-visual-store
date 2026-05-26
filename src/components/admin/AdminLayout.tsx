import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { BarChart3, Boxes, FolderTree, LogOut, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import type { AdminUser } from "@/lib/catalog-types";
import { logoutAdmin } from "@/backend/admin-auth";

// Configuracion intencionalmente oculto del nav. La ruta sigue disponible
// en /admin/configuracion si se accede por URL directa.
const links = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/productos", label: "Productos", icon: Boxes },
  { to: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
] as const;

export function AdminLayout({ admin, children }: { admin: AdminUser; children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const router = useRouter();

  const logout = async () => {
    await logoutAdmin();
    await router.invalidate();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="font-display text-lg font-bold text-brand-deep">L&A Admin</div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">Multiventas</div>
        </div>
        <nav className="space-y-1 p-3">
          {links.map((item) => {
            const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-brand-royal text-white" : "text-slate-600 hover:bg-brand-soft hover:text-brand-deep"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-display text-base font-bold text-brand-deep">Panel administrador</div>
              <div className="text-xs text-slate-500">{admin.fullName || admin.email}</div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}


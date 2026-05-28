import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PackageSearch,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { AdminUser } from "@/lib/catalog-types";
import { logoutAdmin } from "@/backend/admin-auth";
import { cn } from "@/lib/utils";
import { LALogo } from "./LALogo";
import { AdminThemeProvider, ThemeToggle, useAdminTheme } from "./AdminTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; group?: "main" | "catalog" | "ops" | "admin"; badge?: string };

// Solo se exponen secciones con backend real. Marcas/Clientes/Cupones quedan
// como archivos sin entrada de menú hasta que se definan tablas en lamultiventas.
const links: NavItem[] = [
  { to: "/admin",               label: "Dashboard",     icon: LayoutDashboard, group: "main" },
  { to: "/admin/productos",     label: "Productos",     icon: Package,         group: "catalog" },
  { to: "/admin/categorias",    label: "Categorías",    icon: FolderTree,      group: "catalog" },
  { to: "/admin/inventario",    label: "Inventario",    icon: PackageSearch,   group: "catalog" },
  { to: "/admin/pedidos",       label: "Pedidos",       icon: ShoppingBag,     group: "ops" },
  { to: "/admin/reportes",      label: "Reportes",      icon: TrendingUp,      group: "admin" },
  { to: "/admin/usuarios",      label: "Usuarios",      icon: ShieldCheck,     group: "admin" },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings,        group: "admin" },
];

const groupLabels: Record<NonNullable<NavItem["group"]>, string> = {
  main: "General",
  catalog: "Catálogo",
  ops: "Operación",
  admin: "Administración",
};

function ThemedShell({ admin, children }: { admin: AdminUser; children: ReactNode }) {
  const { mode } = useAdminTheme();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const logout = async () => {
    await logoutAdmin();
    await router.invalidate();
    navigate({ to: "/admin/login" });
  };

  const groups = (["main", "catalog", "ops", "admin"] as const).map((g) => ({
    key: g,
    label: groupLabels[g],
    items: links.filter((l) => l.group === g),
  }));

  return (
    <div className={cn("mg-admin", mode === "dark" && "mg-dark", "min-h-screen bg-mg-radial text-mg-text")}>
      {/* SIDEBAR DESKTOP */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-mg-sidebar border-r border-mg-line lg:flex">
        <SidebarContent currentPath={pathname} groups={groups} />
      </aside>

      {/* SIDEBAR MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-mg-sidebar border-r border-mg-line">
            <SidebarContent currentPath={pathname} groups={groups} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 glass-mg-strong">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-mg-line bg-mg-ink/70 text-mg-text lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="relative hidden flex-1 max-w-md sm:block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mg-muted" />
              <input
                type="search"
                placeholder="Buscar productos, pedidos, clientes…"
                className="h-10 w-full rounded-xl border border-mg-line bg-mg-ink/60 pl-10 pr-4 text-sm text-mg-text placeholder:text-mg-muted outline-none transition focus:border-mg-magenta/60 focus:bg-mg-ink/90 focus:ring-2 focus:ring-mg-magenta/20"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-mg-line bg-mg-night px-1.5 py-0.5 text-[10px] font-bold text-mg-muted">⌘ K</kbd>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-xl border border-mg-line bg-mg-ink/70 px-2 py-1.5 text-left transition hover:border-mg-magenta/40">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-mg-magenta-gradient text-[11px] font-bold text-white shadow-mg-glow">
                    {(admin.fullName || admin.email).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden text-xs leading-tight sm:block">
                    <div className="font-bold text-mg-text">{admin.fullName || admin.email}</div>
                    <div className="text-[10px] text-mg-muted">Administrador</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-mg-muted" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-mg-line bg-mg-ink text-mg-text w-56">
                  <DropdownMenuLabel className="text-mg-muted">{admin.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-mg-line" />
                  <DropdownMenuItem asChild className="focus:bg-mg-ink-soft focus:text-mg-pink">
                    <Link to="/admin/configuracion" className="gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" /> Configuración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-mg-ink-soft focus:text-mg-pink">
                    <Link to="/catalogo" className="gap-2 cursor-pointer">
                      <Sparkles className="h-4 w-4" /> Ver tienda pública
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-mg-line" />
                  <DropdownMenuItem onClick={logout} className="gap-2 focus:bg-rose-500/20 focus:text-rose-300">
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8 lg:py-10">
          <div className="animate-fade-up">{children}</div>
        </main>

        <footer className="border-t border-mg-line px-4 py-6 text-center text-xs text-mg-muted lg:px-8">
          <div className="mg-divider mb-4" />
          <p>
            <span className="text-[color:var(--mg-magenta)] font-bold">L&amp;A Multiventas</span> — Panel administrador · © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

function SidebarContent({
  currentPath,
  groups,
  onClose,
}: {
  currentPath: string;
  groups: { key: string; label: string; items: NavItem[] }[];
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="relative border-b border-mg-line px-5 py-5">
        <div className="relative flex items-center justify-between gap-2">
          <Link to="/admin" className="block">
            <LALogo size="md" variant="onDark" />
          </Link>
          {onClose && (
            <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="mg-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.key} className="mb-5">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-mg-muted/70">{g.label}</div>
            <div className="mt-1 space-y-0.5">
              {g.items.map((item) => {
                const active = currentPath === item.to || (item.to !== "/admin" && currentPath.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                      active
                        ? "bg-mg-magenta-gradient text-white shadow-mg-glow"
                        : "text-mg-text/70 hover:bg-mg-ink-soft/60 hover:text-mg-text",
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-mg-gold-gradient shadow-mg-gold" />
                    )}
                    <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-mg-muted group-hover:text-mg-pink")} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                        active ? "bg-white/20 text-white" : "bg-mg-magenta/20 text-mg-pink",
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer card */}
      <div className="border-t border-mg-line p-4">
        <div className="relative overflow-hidden rounded-2xl border border-mg-line bg-mg-ink p-4">
          <div className="flex items-center gap-2 text-[color:var(--mg-gold-soft)]">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Ver tienda</span>
          </div>
          <p className="mt-2 text-xs text-white/70">Abrí el catálogo público en otra pestaña para ver cambios.</p>
          <Link to="/catalogo" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--mg-gold-soft)] hover:text-white">
            <Sparkles className="h-3.5 w-3.5" /> Ir al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout({ admin, children }: { admin: AdminUser; children: ReactNode }) {
  return (
    <AdminThemeProvider>
      <ThemedShell admin={admin}>{children}</ThemedShell>
    </AdminThemeProvider>
  );
}

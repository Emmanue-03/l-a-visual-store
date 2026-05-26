import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { clearSession, getRequestHeader, updateSession, useSession } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import type { AdminUser } from "@/lib/catalog-types";
import { getServerEnv } from "./env";
import { verifyPassword } from "./crypto";
import { restInsert, restSelect, restUpdate } from "./supabase-rest";

type AdminSessionData = {
  adminUserId?: string;
};

type AdminUserRow = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: "admin" | "editor";
  is_active: boolean;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Module-local helpers (no exports = bundler can tree-shake from client chunks).
function sessionConfig() {
  const password = getServerEnv("ADMIN_SESSION_SECRET");
  if (!password) return null;

  return {
    name: "la_admin_session",
    password,
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: getServerEnv("NODE_ENV") === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function publicAdmin(row: AdminUserRow): AdminUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active,
  };
}

// Server-only helpers. createServerOnlyFn is a compile-time marker for the
// TanStack Start plugin: the function is replaced with a client-side stub
// that throws if invoked from the browser, so the implementation body and
// its server-only imports (useSession etc.) never reach the client bundle.
export const getAdminSessionUser = createServerOnlyFn(async (): Promise<AdminUser | null> => {
  const config = sessionConfig();
  if (!config) return null;

  // useSession is a TanStack Start server utility, not a React Hook.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const session = await useSession<AdminSessionData>(config);
  const adminUserId = session.data.adminUserId;
  if (!adminUserId) return null;

  const admins = await restSelect<AdminUserRow>("admin_users", {
    select: "id,email,password_hash,full_name,role,is_active",
    id: `eq.${adminUserId}`,
    limit: 1,
  }).catch(() => [] as AdminUserRow[]);

  const admin = admins[0];
  if (!admin || !admin.is_active) return null;
  return publicAdmin(admin);
});

export const requireAdminUser = createServerOnlyFn(async (): Promise<AdminUser> => {
  const admin = await getAdminSessionUser();
  if (!admin) throw new Error("No autorizado");
  return admin;
});

// Public server fns — handlers inlined so the plugin can split cleanly.
export const getCurrentAdmin = createServerFn({ method: "GET" }).handler(async () => {
  return getAdminSessionUser();
});

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => loginSchema.parse(value))
  .handler(async ({ data }) => {
    const config = sessionConfig();
    if (!config) {
      return {
        ok: false as const,
        message: "Falta configurar ADMIN_SESSION_SECRET en el servidor",
      };
    }

    const email = data.email.trim().toLowerCase();
    let admins: AdminUserRow[] = [];
    try {
      admins = await restSelect<AdminUserRow>("admin_users", {
        select: "id,email,password_hash,full_name,role,is_active",
        email: `eq.${email}`,
        limit: 1,
      });
    } catch (error) {
      console.error("loginAdmin: admin_users lookup failed", error);
      return {
        ok: false as const,
        message:
          "No se pudo consultar admin_users. Verifica SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY y que el schema lamultiventas exista.",
      };
    }

    const admin = admins[0];
    if (!admin) {
      return {
        ok: false as const,
        message: "Usuario no encontrado. Ejecuta npm run admin:bootstrap.",
      };
    }
    if (!admin.is_active) return { ok: false as const, message: "Usuario inactivo" };

    const valid = await verifyPassword(data.password, admin.password_hash);
    if (!valid) return { ok: false as const, message: "Contrasena incorrecta" };

    await updateSession(config, { adminUserId: admin.id });
    await restUpdate(
      "admin_users",
      { last_login_at: new Date().toISOString() },
      { id: `eq.${admin.id}` },
    ).catch(() => null);
    await restInsert("audit_log", {
      admin_user_id: admin.id,
      action: "login",
      entity: "admin_users",
      entity_id: admin.id,
      ip: getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for") ?? null,
      user_agent: getRequestHeader("user-agent") ?? null,
    }).catch(() => null);

    // Redirect from the server fn so Set-Cookie and the navigation arrive in
    // the same response — eliminates the race where the client navigates
    // before the browser persists the session cookie.
    throw redirect({ to: "/admin" });
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const config = sessionConfig();
  if (config) await clearSession(config);
  return { ok: true };
});

import { createServerFn } from "@tanstack/react-start";
import { clearSession, getRequestHeader, updateSession, useSession } from "@tanstack/react-start/server";
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

export async function getAdminSessionUser() {
  const config = sessionConfig();
  if (!config) return null;

  // TanStack Start exposes this server utility as useSession; it is not a React Hook.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const session = await useSession<AdminSessionData>(config);
  const adminUserId = session.data.adminUserId;
  if (!adminUserId) return null;

  const [admin] = await restSelect<AdminUserRow>("admin_users", {
    select: "id,email,password_hash,full_name,role,is_active",
    id: `eq.${adminUserId}`,
    limit: 1,
  }).catch(() => []);

  if (!admin?.is_active) return null;
  return publicAdmin(admin);
}

export async function requireAdminUser() {
  const admin = await getAdminSessionUser();
  if (!admin) throw new Error("No autorizado");
  return admin;
}

export const getCurrentAdmin = createServerFn({ method: "GET" }).handler(getAdminSessionUser);

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => loginSchema.parse(value))
  .handler(async ({ data }) => {
    const config = sessionConfig();
    if (!config) {
      return { ok: false, message: "Falta configurar ADMIN_SESSION_SECRET en el servidor" };
    }

    const email = data.email.trim().toLowerCase();
    const [admin] = await restSelect<AdminUserRow>("admin_users", {
      select: "id,email,password_hash,full_name,role,is_active",
      email: `eq.${email}`,
      limit: 1,
    }).catch(() => []);

    if (!admin || !admin.is_active) return { ok: false, message: "Credenciales invalidas" };

    const valid = await verifyPassword(data.password, admin.password_hash);
    if (!valid) return { ok: false, message: "Credenciales invalidas" };

    await updateSession(config, { adminUserId: admin.id });
    await restUpdate("admin_users", { last_login_at: new Date().toISOString() }, { id: `eq.${admin.id}` });
    await restInsert("audit_log", {
      admin_user_id: admin.id,
      action: "login",
      entity: "admin_users",
      entity_id: admin.id,
      ip: getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for") ?? null,
      user_agent: getRequestHeader("user-agent") ?? null,
    }).catch(() => null);

    return { ok: true, admin: publicAdmin(admin) };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const config = sessionConfig();
  if (config) await clearSession(config);
  return { ok: true };
});

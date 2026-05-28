import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AdminUser } from "@/lib/catalog-types";
import { requireAdminUser } from "./admin-auth";
import { hashPassword } from "./crypto";
import { restDelete, restInsert, restSelect, restUpdate } from "./supabase-rest";

type AdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor";
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
};

const createSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1).nullable().optional(),
  password: z.string().min(8),
  role: z.enum(["admin", "editor"]).default("admin"),
  is_active: z.coerce.boolean().default(true),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1).nullable().optional(),
  role: z.enum(["admin", "editor"]).optional(),
  is_active: z.coerce.boolean().optional(),
  password: z.string().min(8).optional(),
});

function publicRow(row: AdminUserRow) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
  };
}

export const listAdminUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUser();
  const rows = await restSelect<AdminUserRow>("admin_users", {
    select: "id,email,full_name,role,is_active,last_login_at,created_at",
    order: "created_at.desc",
  }).catch(() => [] as AdminUserRow[]);
  return rows.map(publicRow);
});

export const createAdminUser = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => createSchema.parse(value))
  .handler(async ({ data }) => {
    const me = await requireAdminUser();
    const email = data.email.trim().toLowerCase();
    const password_hash = await hashPassword(data.password);
    const [row] = await restInsert<AdminUserRow>("admin_users", {
      email,
      full_name: data.full_name ?? null,
      password_hash,
      role: data.role,
      is_active: data.is_active,
    });
    await restInsert("audit_log", {
      admin_user_id: me.id,
      action: "create",
      entity: "admin_users",
      entity_id: row?.id ?? null,
      new_data: { email, role: data.role, is_active: data.is_active },
    }).catch(() => null);
    return row ? publicRow(row) : null;
  });

export const updateAdminUser = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => updateSchema.parse(value))
  .handler(async ({ data }) => {
    const me = await requireAdminUser();
    const payload: Record<string, unknown> = {};
    if (data.full_name !== undefined) payload.full_name = data.full_name;
    if (data.role !== undefined) payload.role = data.role;
    if (data.is_active !== undefined) payload.is_active = data.is_active;
    if (data.password) payload.password_hash = await hashPassword(data.password);

    const [row] = await restUpdate<AdminUserRow>("admin_users", payload, { id: `eq.${data.id}` });
    await restInsert("audit_log", {
      admin_user_id: me.id,
      action: "update",
      entity: "admin_users",
      entity_id: data.id,
      new_data: { ...payload, password_hash: data.password ? "***" : undefined },
    }).catch(() => null);
    return row ? publicRow(row) : null;
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .inputValidator((value: { id: string }) => value)
  .handler(async ({ data }) => {
    const me = await requireAdminUser();
    if (data.id === me.id) {
      throw new Error("No podés eliminar tu propio usuario.");
    }
    await restDelete("admin_users", { id: `eq.${data.id}` });
    await restInsert("audit_log", {
      admin_user_id: me.id,
      action: "delete",
      entity: "admin_users",
      entity_id: data.id,
    }).catch(() => null);
    return { ok: true };
  });

export type AdminUserPublic = ReturnType<typeof publicRow>;
export type { AdminUser };

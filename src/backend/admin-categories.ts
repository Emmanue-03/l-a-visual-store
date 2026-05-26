import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Category } from "@/lib/catalog-types";
import { requireAdminUser } from "./admin-auth";
import { restInsert, restSelect, restUpdate } from "./supabase-rest";

const nullableText = z.string().trim().optional().transform((value) => value || null);

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(2),
  description: nullableText,
  icon: nullableText,
  sort_order: z.coerce.number().int().default(0),
  is_featured: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
  seo_title: nullableText,
  seo_description: nullableText,
});

export type AdminCategoryRow = Category & {
  id: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
};

export const listAdminCategories = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUser();
  return restSelect<AdminCategoryRow>("categories", { select: "*", order: "sort_order.asc,name.asc" });
});

export const saveAdminCategory = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => categorySchema.parse(value))
  .handler(async ({ data }) => {
    const admin = await requireAdminUser();
    const payload = { ...data, slug: data.slug.trim().toLowerCase() };
    const result = data.id
      ? await restUpdate<AdminCategoryRow>("categories", payload, { id: `eq.${data.id}` })
      : await restInsert<AdminCategoryRow>("categories", payload);

    await restInsert("audit_log", {
      admin_user_id: admin.id,
      action: data.id ? "update" : "create",
      entity: "categories",
      entity_id: result[0]?.id ?? data.id ?? null,
      new_data: payload,
    }).catch(() => null);

    return result[0] ?? null;
  });

export const setAdminCategoryActive = createServerFn({ method: "POST" })
  .inputValidator((value: { id: string; is_active: boolean }) => value)
  .handler(async ({ data }) => {
    const admin = await requireAdminUser();
    const [category] = await restUpdate<AdminCategoryRow>(
      "categories",
      { is_active: data.is_active },
      { id: `eq.${data.id}` },
    );
    await restInsert("audit_log", {
      admin_user_id: admin.id,
      action: data.is_active ? "activate" : "deactivate",
      entity: "categories",
      entity_id: data.id,
      new_data: { is_active: data.is_active },
    }).catch(() => null);
    return category ?? null;
  });

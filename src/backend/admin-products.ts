import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { DbProduct } from "@/lib/catalog-mappers";
import type { Category } from "@/lib/catalog-types";
import { requireAdminUser } from "./admin-auth";
import { restInsert, restSelect, restUpdate } from "./supabase-rest";

// nullish() acepta string | null | undefined — el form envía null para campos vacios
// (SKU, SEO title/description, etc.). Con .optional() solo, zod rechazaba el null.
const nullableText = z
  .string()
  .trim()
  .nullish()
  .transform((value) => (typeof value === "string" && value ? value : null));
const textList = z.array(z.string()).default([]).transform((items) => items.map((item) => item.trim()).filter(Boolean));

const productSchema = z.object({
  id: z.string().uuid().optional(),
  sku: nullableText,
  slug: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(1),
  short_description: nullableText,
  category_id: nullableText,
  price: z.coerce.number().int().positive(),
  old_price: z.coerce.number().int().positive().nullable().optional(),
  cost_price: z.coerce.number().int().nonnegative().nullable().optional(),
  currency: z.string().default("PYG"),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviews_count: z.coerce.number().int().nonnegative().default(0),
  badge: z.enum(["Oferta", "Nuevo", "Top venta"]).nullable().optional(),
  stock: z.coerce.number().int().nonnegative().default(0),
  low_stock_threshold: z.coerce.number().int().nonnegative().default(5),
  image_url: z.string().url(),
  gallery_urls: textList,
  features: textList,
  is_active: z.coerce.boolean().default(true),
  is_featured: z.coerce.boolean().default(false),
  is_best_seller: z.coerce.boolean().default(false),
  is_new_arrival: z.coerce.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  seo_title: nullableText,
  seo_description: nullableText,
});

async function getCategoriesMap() {
  const rows = await restSelect<Category & { sort_order: number; is_active: boolean }>("categories", {
    select: "*",
    order: "sort_order.asc,name.asc",
  });
  return rows.reduce<Record<string, Category>>((acc, row) => {
    if (row.id) acc[row.id] = row;
    return acc;
  }, {});
}

async function readProducts(): Promise<DbProduct[]> {
  const [rows, categories] = await Promise.all([
    restSelect<DbProduct>("products", { select: "*", order: "created_at.desc" }).catch(() => []),
    getCategoriesMap().catch(() => ({})),
  ]);

  // Devuelve filas crudas (snake_case) enriquecidas con el slug/nombre de la
  // categoria para que la UI muestre el dato y el dialog de edicion reciba
  // la forma esperada por ProductForm.
  return rows.map((row) => {
    const category = row.category_id ? categories[row.category_id] : undefined;
    return {
      ...row,
      category_slug: category?.slug ?? "sin-categoria",
      category_name: category?.name ?? "Sin categoria",
    };
  });
}

export const listAdminProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUser();
  return readProducts();
});

export const getAdminProduct = createServerFn({ method: "GET" })
  .inputValidator((value: { id: string }) => value)
  .handler(async ({ data }) => {
    await requireAdminUser();
    const [product] = await restSelect<DbProduct>("products", { select: "*", id: `eq.${data.id}`, limit: 1 });
    return product ?? null;
  });

export const saveAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => productSchema.parse(value))
  .handler(async ({ data }) => {
    const admin = await requireAdminUser();
    const payload = { ...data, slug: data.slug.trim().toLowerCase() };
    const result = data.id
      ? await restUpdate<DbProduct>("products", payload, { id: `eq.${data.id}` })
      : await restInsert<DbProduct>("products", payload);

    await restInsert("audit_log", {
      admin_user_id: admin.id,
      action: data.id ? "update" : "create",
      entity: "products",
      entity_id: result[0]?.id ?? data.id ?? null,
      new_data: payload,
    }).catch(() => null);

    return result[0] ?? null;
  });

export const setAdminProductActive = createServerFn({ method: "POST" })
  .inputValidator((value: { id: string; is_active: boolean }) => value)
  .handler(async ({ data }) => {
    const admin = await requireAdminUser();
    const [product] = await restUpdate<DbProduct>("products", { is_active: data.is_active }, { id: `eq.${data.id}` });
    await restInsert("audit_log", {
      admin_user_id: admin.id,
      action: data.is_active ? "activate" : "deactivate",
      entity: "products",
      entity_id: data.id,
      new_data: { is_active: data.is_active },
    }).catch(() => null);
    return product ?? null;
  });

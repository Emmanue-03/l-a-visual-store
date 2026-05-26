import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { OrderStatus, SiteSettings } from "@/lib/catalog-types";
import { mapSettings } from "@/lib/catalog-mappers";
import { requireAdminUser } from "./admin-auth";
import { restInsert, restSelect, restUpdate } from "./supabase-rest";

export type AdminOrder = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_address: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  source: string;
  whatsapp_message: string | null;
  notes: string | null;
  created_at: string;
};

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["draft", "pending", "confirmed", "paid", "cancelled", "delivered"]),
});

const settingsSchema = z.object({
  storeName: z.string().min(1),
  whatsappPhone: z.string().min(6),
  currency: z.string().min(3),
  defaultShippingCost: z.coerce.number().int().nonnegative(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const getAdminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUser();
  const [products, categories, orders] = await Promise.all([
    restSelect<{ id: string; is_active: boolean; stock: number; low_stock_threshold: number }>("products", { select: "id,is_active,stock,low_stock_threshold" }),
    restSelect<{ id: string; is_active: boolean }>("categories", { select: "id,is_active" }),
    restSelect<AdminOrder>("orders", { select: "*", order: "created_at.desc", limit: 6 }),
  ]);

  return {
    totalProducts: products.length,
    activeProducts: products.filter((product) => product.is_active).length,
    lowStockProducts: products.filter((product) => product.stock <= product.low_stock_threshold).length,
    activeCategories: categories.filter((category) => category.is_active).length,
    recentOrders: orders,
  };
});

export const listAdminOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUser();
  return restSelect<AdminOrder>("orders", { select: "*", order: "created_at.desc" });
});

export const updateAdminOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => statusSchema.parse(value))
  .handler(async ({ data }) => {
    const admin = await requireAdminUser();
    const [order] = await restUpdate<AdminOrder>("orders", { status: data.status }, { id: `eq.${data.id}` });
    await restInsert("audit_log", {
      admin_user_id: admin.id,
      action: "status_update",
      entity: "orders",
      entity_id: data.id,
      new_data: { status: data.status },
    }).catch(() => null);
    return order ?? null;
  });

export const getAdminSettings = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUser();
  const rows = await restSelect<{ key: string; value: unknown }>("site_settings", { select: "key,value" });
  return mapSettings(rows);
});

export const saveAdminSettings = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => settingsSchema.parse(value))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const settings: Record<string, unknown> = {
      store_name: data.storeName,
      whatsapp_phone: data.whatsappPhone,
      currency: data.currency,
      default_shipping_cost: data.defaultShippingCost,
      seo_title: data.seoTitle ?? "",
      seo_description: data.seoDescription ?? "",
    };

    await Promise.all(Object.entries(settings).map(([key, value]) =>
      restUpdate("site_settings", { value }, { key: `eq.${key}` }).then(async (rows) => {
        if (!rows.length) {
          await restInsert("site_settings", { key, value });
        }
      }),
    ));

    return data satisfies SiteSettings;
  });

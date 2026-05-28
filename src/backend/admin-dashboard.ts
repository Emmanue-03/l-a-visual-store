import { createServerFn } from "@tanstack/react-start";
import { requireAdminUser } from "./admin-auth";
import { restSelect } from "./supabase-rest";

type ProductLite = {
  id: string;
  name: string | null;
  image_url: string | null;
  sku: string | null;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
  price: number;
};

type CategoryLite = { id: string; is_active: boolean };

type OrderLite = {
  id: string;
  order_number: string;
  customer_name: string | null;
  status: string;
  total: number;
  created_at: string;
};

async function safe<T>(table: string, query: Parameters<typeof restSelect<T>>[1]): Promise<T[]> {
  try {
    return await restSelect<T>(table, query);
  } catch (error) {
    console.warn(`[admin-dashboard] ${table} unavailable:`, error);
    return [];
  }
}

export const getDashboardMetrics = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUser();

  const [products, categories, recentOrders, allOrders] = await Promise.all([
    safe<ProductLite>("products", {
      select: "id,name,image_url,sku,stock,low_stock_threshold,is_active,price",
      order: "created_at.desc",
    }),
    safe<CategoryLite>("categories", { select: "id,is_active" }),
    safe<OrderLite>("orders", {
      select: "id,order_number,customer_name,status,total,created_at",
      order: "created_at.desc",
      limit: 8,
    }),
    safe<{ total: number; created_at: string; status: string }>("orders", {
      select: "total,created_at,status",
      order: "created_at.desc",
      limit: 500,
    }),
  ]);

  const now = Date.now();
  const ms7 = 7 * 24 * 60 * 60 * 1000;
  const ms30 = 30 * 24 * 60 * 60 * 1000;
  const paidStatuses = new Set(["paid", "confirmed", "delivered"]);

  const ordersInWindow = (window: number) =>
    allOrders.filter((o) => {
      const ts = new Date(o.created_at).getTime();
      return !Number.isNaN(ts) && now - ts <= window;
    });

  const sales7 = ordersInWindow(ms7)
    .filter((o) => paidStatuses.has(o.status))
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const sales30 = ordersInWindow(ms30)
    .filter((o) => paidStatuses.has(o.status))
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const lowStock = products
    .filter((p) => p.stock > 0 && p.stock <= p.low_stock_threshold)
    .slice(0, 6);
  const outOfStock = products.filter((p) => p.stock === 0);

  return {
    totals: {
      products: products.length,
      activeProducts: products.filter((p) => p.is_active).length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      activeCategories: categories.filter((c) => c.is_active).length,
      pendingOrders: allOrders.filter((o) => o.status === "pending").length,
    },
    revenue: {
      last7Days: sales7,
      last30Days: sales30,
    },
    recentOrders,
    lowStock: lowStock.map((p) => ({
      id: p.id,
      name: p.name ?? "(sin nombre)",
      sku: p.sku,
      imageUrl: p.image_url,
      stock: p.stock,
      threshold: p.low_stock_threshold,
    })),
  };
});

export type DashboardMetrics = Awaited<ReturnType<typeof getDashboardMetrics>>;

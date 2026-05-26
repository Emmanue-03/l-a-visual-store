import { createServerFn } from "@tanstack/react-start";
import { mapDbCategory, mapDbProduct, mapSettings, type DbProduct } from "@/lib/catalog-mappers";
import type { Category, Product, SiteSettings } from "@/lib/catalog-types";
import { categories as mockCategories, products as mockProducts } from "@/lib/mock-data";
import { restSelect } from "./supabase-rest";

type CatalogPayload = {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
};

const fallbackSettings: SiteSettings = {
  storeName: "L&A Multiventas",
  whatsappPhone: "595981625726",
  currency: "PYG",
  defaultShippingCost: 0,
};

export async function getCatalogData(): Promise<CatalogPayload> {
  try {
    const [productsRows, categoryRows, settingsRows] = await Promise.all([
      restSelect<DbProduct>("active_products", { select: "*" }),
      restSelect<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        icon: string | null;
        sort_order: number;
        is_featured: boolean;
        is_active: boolean;
        seo_title: string | null;
        seo_description: string | null;
      }>("categories", {
        select: "*",
        is_active: "eq.true",
        order: "sort_order.asc,name.asc",
      }),
      restSelect<{ key: string; value: unknown }>("site_settings", { select: "key,value" }),
    ]);

    const products = productsRows.map(mapDbProduct);
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    }, {});

    return {
      products,
      categories: categoryRows.map((category) => mapDbCategory(category, counts[category.slug] ?? 0)),
      settings: mapSettings(settingsRows),
    };
  } catch (error) {
    console.warn("Using mock catalog fallback:", error);
    return {
      products: mockProducts,
      categories: mockCategories,
      settings: fallbackSettings,
    };
  }
}

export const getCatalog = createServerFn({ method: "GET" }).handler(getCatalogData);

export const getProductBySlugOrId = createServerFn({ method: "GET" })
  .inputValidator((value: { id: string }) => value)
  .handler(async ({ data }) => {
    const catalog = await getCatalogData();
    return catalog.products.find((product) => product.slug === data.id || product.id === data.id) ?? null;
  });

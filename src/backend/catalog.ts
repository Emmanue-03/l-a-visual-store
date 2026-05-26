import { createServerFn } from "@tanstack/react-start";
import { mapDbCategory, mapDbProduct, mapSettings, type DbProduct } from "@/lib/catalog-mappers";
import type { Category, Product, SiteSettings } from "@/lib/catalog-types";
import { categories as mockCategories, products as mockProducts } from "@/lib/mock-data";
import { restSelect } from "./supabase-rest";

type CatalogPayload = {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  /** "db" si los datos vienen de Supabase, "mock" si cayo al fallback. */
  source: "db" | "mock";
  /** Mensaje de error que provoco el fallback, si lo hubo. */
  fallbackReason?: string;
};

const fallbackSettings: SiteSettings = {
  storeName: "L&A Multiventas",
  whatsappPhone: "595975484333",
  currency: "PYG",
  defaultShippingCost: 0,
};

function mockPayload(reason?: string): CatalogPayload {
  return {
    products: mockProducts,
    categories: mockCategories,
    settings: fallbackSettings,
    source: "mock",
    fallbackReason: reason,
  };
}

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
    const norm = (value?: string | null) => (value ?? "").trim().toLowerCase();
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      const key = norm(product.category);
      if (!key) return acc;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return {
      products,
      categories: categoryRows.map((category) =>
        mapDbCategory(category, counts[norm(category.slug)] ?? 0),
      ),
      settings: mapSettings(settingsRows),
      source: "db",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[catalog] Supabase failed — using mock:", message);
    return mockPayload(message);
  }
}

// Server fn internos. Si hay servidor, hacen el trabajo real.
const _getCatalogServer = createServerFn({ method: "GET" }).handler(getCatalogData);

const _getProductBySlugOrIdServer = createServerFn({ method: "GET" })
  .inputValidator((value: { id: string }) => value)
  .handler(async ({ data }) => {
    const catalog = await getCatalogData();
    return catalog.products.find((product) => product.slug === data.id || product.id === data.id) ?? null;
  });

// Wrappers publicos con fallback a mock cuando NO hay servidor (SPA-only en
// Vercel). En SPA el server fn intenta hacer fetch a un endpoint que no
// existe, la promesa rechaza con network error, y el catch cae a mock.
// En modo SSR (cuando vuelva), el server fn ejecuta normalmente.
export async function getCatalog(): Promise<CatalogPayload> {
  try {
    return await _getCatalogServer();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[catalog] getCatalog server fn fallo, mock:", message);
    return mockPayload(message);
  }
}

export async function getProductBySlugOrId(input: {
  data: { id: string };
}): Promise<Product | null> {
  try {
    return await _getProductBySlugOrIdServer(input);
  } catch (error) {
    console.warn(
      "[catalog] getProductBySlugOrId server fn fallo, buscando en mock:",
      error instanceof Error ? error.message : String(error),
    );
    const id = input.data.id;
    return mockProducts.find((product) => product.slug === id || product.id === id) ?? null;
  }
}

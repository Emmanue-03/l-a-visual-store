// Catalogo del lado CLIENTE (SPA estatica) — reemplaza las server functions de
// src/backend/catalog.ts. Misma forma de datos y mismo fallback a mock, pero
// lee Supabase directo desde el navegador con la anon key.
//
// Las rutas publicas (index, catalogo, producto) importan getCatalog desde aca.

import { useQuery } from "@tanstack/react-query";
import { mapDbCategory, mapDbProduct, mapSettings, type DbProduct } from "@/lib/catalog-mappers";
import type { Category, Product, SiteSettings } from "@/lib/catalog-types";
import { categories as mockCategories, products as mockProducts } from "@/lib/mock-data";
import { restSelect } from "@/lib/supabase-rest-client";

export type CatalogPayload = {
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

const norm = (value?: string | null) => (value ?? "").trim().toLowerCase();

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
    console.error(
      "[catalog] Cayendo al fallback de mock data — la lectura de Supabase fallo:",
      message,
    );
    return {
      products: mockProducts,
      categories: mockCategories,
      settings: fallbackSettings,
      source: "mock",
      fallbackReason: message,
    };
  }
}

// Alias con la misma firma que la server fn anterior (sin argumentos).
export const getCatalog = getCatalogData;

export async function getProductBySlugOrId(id: string): Promise<Product | null> {
  const catalog = await getCatalogData();
  return catalog.products.find((product) => product.slug === id || product.id === id) ?? null;
}

/**
 * Hook de React Query para leer el catalogo desde el navegador. Lo usan tanto
 * el layout (Navbar/Footer) como las paginas publicas, asi se hace UN solo
 * fetch compartido (React Query dedupea por la queryKey). getCatalogData nunca
 * lanza (cae a mock), por lo que no hay estado de error que manejar.
 */
export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: getCatalogData,
    staleTime: 5 * 60 * 1000,
  });
}

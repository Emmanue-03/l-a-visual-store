import type { Category, Product, SiteSettings } from "./catalog-types";

type DbCategory = {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number | null;
  is_featured?: boolean | null;
  is_active?: boolean | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

export type DbProduct = {
  id: string;
  sku?: string | null;
  slug: string;
  name: string;
  description: string;
  short_description?: string | null;
  category_id?: string | null;
  category_slug?: string | null;
  category_name?: string | null;
  price: number;
  old_price?: number | null;
  cost_price?: number | null;
  currency?: string | null;
  rating?: number | string | null;
  reviews_count?: number | null;
  badge?: Product["badge"] | null;
  stock?: number | null;
  low_stock_threshold?: number | null;
  image_url: string;
  gallery_urls?: string[] | null;
  features?: string[] | null;
  is_active?: boolean | null;
  is_featured?: boolean | null;
  is_best_seller?: boolean | null;
  is_new_arrival?: boolean | null;
  seo_title?: string | null;
  seo_description?: string | null;
  sort_order?: number | null;
};

export function mapDbCategory(category: DbCategory, count = 0): Category {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    count,
    description: category.description,
    icon: category.icon,
    sortOrder: category.sort_order ?? 0,
    isFeatured: category.is_featured ?? false,
    isActive: category.is_active ?? true,
    seoTitle: category.seo_title,
    seoDescription: category.seo_description,
  };
}

export function mapDbProduct(product: DbProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    price: product.price,
    oldPrice: product.old_price ?? undefined,
    costPrice: product.cost_price,
    rating: Number(product.rating ?? 0),
    reviews: product.reviews_count ?? 0,
    category: product.category_slug ?? "",
    categoryId: product.category_id ?? null,
    categoryName: product.category_name ?? undefined,
    image: product.image_url,
    gallery: product.gallery_urls ?? [],
    badge: product.badge ?? undefined,
    stock: product.stock ?? 0,
    lowStockThreshold: product.low_stock_threshold ?? 5,
    description: product.description,
    shortDescription: product.short_description,
    features: product.features ?? [],
    isActive: product.is_active ?? true,
    isFeatured: product.is_featured ?? false,
    isBestSeller: product.is_best_seller ?? false,
    isNewArrival: product.is_new_arrival ?? false,
    seoTitle: product.seo_title,
    seoDescription: product.seo_description,
  };
}

export function mapSettings(rows: { key: string; value: unknown }[]): SiteSettings {
  const values = Object.fromEntries(rows.map((row) => [row.key, row.value])) as Record<string, unknown>;
  return {
    storeName: String(values.store_name ?? "L&A Multiventas"),
    whatsappPhone: String(values.whatsapp_phone ?? "595975484333"),
    currency: String(values.currency ?? "PYG"),
    defaultShippingCost: Number(values.default_shipping_cost ?? 0),
    seoTitle: typeof values.seo_title === "string" ? values.seo_title : undefined,
    seoDescription: typeof values.seo_description === "string" ? values.seo_description : undefined,
  };
}

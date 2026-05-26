export type ProductBadge = "Oferta" | "Nuevo" | "Top venta";

export type Product = {
  id: string;
  slug?: string;
  sku?: string | null;
  name: string;
  price: number;
  oldPrice?: number;
  costPrice?: number | null;
  rating: number;
  reviews: number;
  category: string;
  categoryName?: string;
  image: string;
  gallery?: string[];
  badge?: ProductBadge;
  stock: number;
  lowStockThreshold?: number;
  description: string;
  shortDescription?: string | null;
  features: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type Category = {
  id?: string;
  slug: string;
  name: string;
  count?: number;
  description?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type SiteSettings = {
  storeName: string;
  whatsappPhone: string;
  currency: string;
  defaultShippingCost: number;
  seoTitle?: string;
  seoDescription?: string;
};

export type OrderStatus = "draft" | "pending" | "confirmed" | "paid" | "cancelled" | "delivered";

export type AdminUser = {
  id: string;
  email: string;
  fullName?: string | null;
  role: "admin" | "editor";
  isActive: boolean;
};

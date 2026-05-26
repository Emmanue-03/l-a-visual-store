import { getCatalog, getProductBySlugOrId } from "@/backend/catalog";

export const catalogService = {
  list: getCatalog,
  getProduct: getProductBySlugOrId,
};


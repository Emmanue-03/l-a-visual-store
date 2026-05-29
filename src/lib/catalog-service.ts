import { getCatalog, getProductBySlugOrId } from "@/lib/catalog-client";

export const catalogService = {
  list: getCatalog,
  getProduct: getProductBySlugOrId,
};


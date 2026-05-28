/**
 * Mock data para módulos admin nuevos (marcas, inventario, clientes, cupones,
 * usuarios admin, reportes). Diseñado como capa autosuficiente para validar la
 * UI mientras se desarrollan los schemas en Postgres.
 */

export type MockBrand = {
  id: string;
  name: string;
  slug: string;
  country: string;
  logoUrl: string;
  productsCount: number;
  totalSales: number;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
};

export type MockProduct = {
  id: string;
  name: string;
  sku: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  volumeMl: number;
  family: string;
  notes: string[];
  createdAt: string;
};

export type MockCustomerTier = "bronze" | "silver" | "gold" | "platinum";

export type MockCustomer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  avatarUrl: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
  tier: MockCustomerTier;
  joinedAt: string;
};

export type MockOrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type MockOrder = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: MockOrderStatus;
  items: number;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "card" | "transfer" | "cash";
  createdAt: string;
};

export type MockCoupon = {
  id: string;
  code: string;
  description: string;
  type: "percent" | "fixed";
  value: number;
  minPurchase: number;
  maxUses: number;
  uses: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
};

export type MockAdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatarUrl: string;
  lastLoginAt: string;
  isActive: boolean;
  createdAt: string;
};

export type MockInventoryMovement = {
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  type: "in" | "out" | "adjust";
  quantity: number;
  reason: string;
  user: string;
  createdAt: string;
};

export type MockCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productsCount: number;
  isActive: boolean;
};

// ──────────────────────────────────────────────────────────────────────────
// MARCAS
// ──────────────────────────────────────────────────────────────────────────
export const mockBrands: MockBrand[] = [
  { id: "br-01", name: "Dior", slug: "dior", country: "Francia", logoUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=120&q=80", productsCount: 24, totalSales: 18_450_000, featured: true, isActive: true, createdAt: "2024-01-12" },
  { id: "br-02", name: "Chanel", slug: "chanel", country: "Francia", logoUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=120&q=80", productsCount: 19, totalSales: 22_100_000, featured: true, isActive: true, createdAt: "2024-01-12" },
  { id: "br-03", name: "Yves Saint Laurent", slug: "ysl", country: "Francia", logoUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=120&q=80", productsCount: 17, totalSales: 14_900_000, featured: true, isActive: true, createdAt: "2024-02-04" },
  { id: "br-04", name: "Carolina Herrera", slug: "ch", country: "Venezuela", logoUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=120&q=80", productsCount: 21, totalSales: 16_780_000, featured: true, isActive: true, createdAt: "2024-02-18" },
  { id: "br-05", name: "Versace", slug: "versace", country: "Italia", logoUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&q=80", productsCount: 13, totalSales: 9_300_000, featured: false, isActive: true, createdAt: "2024-03-01" },
  { id: "br-06", name: "Paco Rabanne", slug: "paco-rabanne", country: "España", logoUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=120&q=80", productsCount: 14, totalSales: 11_650_000, featured: false, isActive: true, createdAt: "2024-03-10" },
  { id: "br-07", name: "Jean Paul Gaultier", slug: "jpg", country: "Francia", logoUrl: "https://images.unsplash.com/photo-1565732777843-fc4b6d63e4e8?w=120&q=80", productsCount: 11, totalSales: 7_980_000, featured: false, isActive: true, createdAt: "2024-04-02" },
  { id: "br-08", name: "Giorgio Armani", slug: "armani", country: "Italia", logoUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=120&q=80", productsCount: 16, totalSales: 13_400_000, featured: false, isActive: true, createdAt: "2024-04-16" },
  { id: "br-09", name: "Tom Ford", slug: "tom-ford", country: "Estados Unidos", logoUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=120&q=80", productsCount: 9, totalSales: 19_650_000, featured: true, isActive: true, createdAt: "2024-05-08" },
  { id: "br-10", name: "Lancôme", slug: "lancome", country: "Francia", logoUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=120&q=80", productsCount: 12, totalSales: 8_120_000, featured: false, isActive: false, createdAt: "2024-05-21" },
];

// ──────────────────────────────────────────────────────────────────────────
// CATEGORÍAS
// ──────────────────────────────────────────────────────────────────────────
export const mockCategories: MockCategory[] = [
  { id: "cat-01", name: "Eau de Parfum", slug: "edp", description: "Concentración 15–20%, duración 6–8h", productsCount: 64, isActive: true },
  { id: "cat-02", name: "Eau de Toilette", slug: "edt", description: "Concentración 5–15%, duración 3–5h", productsCount: 48, isActive: true },
  { id: "cat-03", name: "Parfum", slug: "parfum", description: "Concentración 20–30%, máxima duración", productsCount: 12, isActive: true },
  { id: "cat-04", name: "Eau Fraîche", slug: "fraiche", description: "Concentración 1–3%, frescura ligera", productsCount: 9, isActive: true },
  { id: "cat-05", name: "Body Mist", slug: "mist", description: "Bruma corporal aromática", productsCount: 21, isActive: true },
  { id: "cat-06", name: "Decants", slug: "decants", description: "Muestras y formatos viajero", productsCount: 38, isActive: true },
  { id: "cat-07", name: "Set & Estuches", slug: "sets", description: "Estuches de regalo premium", productsCount: 16, isActive: true },
  { id: "cat-08", name: "Edición Limitada", slug: "limitada", description: "Lanzamientos exclusivos", productsCount: 7, isActive: false },
];

// ──────────────────────────────────────────────────────────────────────────
// PRODUCTOS
// ──────────────────────────────────────────────────────────────────────────
const perfumeImages = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
  "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&q=80",
  "https://images.unsplash.com/photo-1565732777843-fc4b6d63e4e8?w=400&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
];

const productNames = [
  ["Sauvage Elixir", "br-01", "cat-03", ["Bergamota", "Lavanda", "Sándalo"]],
  ["Miss Dior Blooming", "br-01", "cat-01", ["Peonía", "Rosa", "Almizcle"]],
  ["J'adore Infinissime", "br-01", "cat-01", ["Ylang ylang", "Jazmín", "Rosa"]],
  ["Coco Mademoiselle", "br-02", "cat-01", ["Naranja", "Pachulí", "Vainilla"]],
  ["Bleu de Chanel", "br-02", "cat-01", ["Limón", "Madera", "Incienso"]],
  ["Chance Eau Tendre", "br-02", "cat-02", ["Pomelo", "Membrillo", "Jazmín"]],
  ["Libre Intense", "br-03", "cat-01", ["Mandarina", "Lavanda", "Ámbar"]],
  ["Y Le Parfum", "br-03", "cat-03", ["Manzana", "Salvia", "Cedro"]],
  ["Black Opium", "br-03", "cat-01", ["Café", "Vainilla", "Flor de azahar"]],
  ["Good Girl Blush", "br-04", "cat-01", ["Tuberosa", "Rosa", "Almendra"]],
  ["Very Good Girl", "br-04", "cat-01", ["Cereza", "Rosa", "Madera"]],
  ["212 VIP Rosé", "br-04", "cat-02", ["Champán", "Rosa", "Almizcle"]],
  ["Eros Flame", "br-05", "cat-01", ["Mandarina", "Pimienta", "Romero"]],
  ["Bright Crystal Absolu", "br-05", "cat-01", ["Granada", "Yuzu", "Peonía"]],
  ["1 Million Elixir", "br-06", "cat-03", ["Canela", "Cuero", "Pachulí"]],
  ["Lady Million Empire", "br-06", "cat-01", ["Mandarina", "Neroli", "Pachulí"]],
  ["La Belle Le Parfum", "br-07", "cat-03", ["Pera", "Vainilla", "Sándalo"]],
  ["Scandal Pour Homme", "br-07", "cat-02", ["Mandarina", "Canela", "Cuero"]],
  ["Acqua di Giò Profondo", "br-08", "cat-01", ["Bergamota", "Romero", "Pachulí"]],
  ["Sì Passione Eclat", "br-08", "cat-01", ["Frambuesa", "Ylang", "Vainilla"]],
  ["Tobacco Vanille", "br-09", "cat-03", ["Tabaco", "Vainilla", "Cacao"]],
  ["Black Orchid", "br-09", "cat-01", ["Trufa", "Orquídea negra", "Pachulí"]],
  ["Lost Cherry", "br-09", "cat-03", ["Cereza", "Almendra amarga", "Tonka"]],
  ["Idôle L'Intense", "br-10", "cat-01", ["Rosa", "Jazmín", "Almizcle"]],
  ["La Vie est Belle Iris", "br-10", "cat-01", ["Iris", "Pera", "Praliné"]],
] as const;

export const mockProducts: MockProduct[] = productNames.map((row, idx) => {
  const [name, brandId, categoryId, notes] = row;
  const brand = mockBrands.find((b) => b.id === brandId)!;
  const category = mockCategories.find((c) => c.id === categoryId)!;
  const families = ["Floral", "Oriental", "Amaderado", "Cítrico", "Aromático", "Chipre", "Gourmand"];
  const price = 280_000 + (idx * 47_000) % 1_400_000;
  const cost = Math.round(price * 0.42);
  const stock = idx % 7 === 0 ? 0 : (idx % 4 === 0 ? 3 : 12 + (idx * 7) % 60);
  return {
    id: `pr-${String(idx + 1).padStart(3, "0")}`,
    name,
    sku: `MG-${brand.slug.toUpperCase().slice(0, 3)}-${String(idx + 1).padStart(4, "0")}`,
    brandId,
    brandName: brand.name,
    categoryId,
    categoryName: category.name,
    imageUrl: perfumeImages[idx % perfumeImages.length],
    price,
    cost,
    stock,
    lowStockThreshold: 5,
    isActive: idx % 11 !== 0,
    isFeatured: idx < 8,
    volumeMl: [30, 50, 100, 100, 100, 150][idx % 6],
    family: families[idx % families.length],
    notes: [...notes],
    createdAt: new Date(2025, idx % 12, 1 + (idx % 27)).toISOString().slice(0, 10),
  };
});

// ──────────────────────────────────────────────────────────────────────────
// CLIENTES
// ──────────────────────────────────────────────────────────────────────────
const customerNames = [
  "Sofía Benítez", "Camila Ortiz", "Valentina Ramírez", "Lucía Acosta", "Renata Cabrera",
  "Martina Duarte", "Antonella Vega", "Emilia Riveros", "Isabella Núñez", "Catalina Ayala",
  "Florencia Pereira", "Agustina Méndez", "Mía Domínguez", "Julieta Báez", "Pilar González",
  "Constanza Salinas", "Delfina Ojeda", "Maite Insfrán", "Bruna Villalba", "Aitana Recalde",
  "Sebastián Cáceres", "Mauricio Galeano", "Ignacio Franco", "Federico Britos", "Luciano Mareco",
];

const cities = ["Asunción", "Ciudad del Este", "Encarnación", "Luque", "San Lorenzo", "Lambaré", "Fernando de la Mora"];

export const mockCustomers: MockCustomer[] = customerNames.map((name, idx) => {
  const totalOrders = 1 + (idx * 3) % 14;
  const avgTicket = 450_000 + (idx * 23_000) % 800_000;
  const totalSpent = totalOrders * avgTicket;
  const tier: MockCustomerTier =
    totalSpent > 8_000_000 ? "platinum" :
    totalSpent > 4_000_000 ? "gold" :
    totalSpent > 1_500_000 ? "silver" : "bronze";
  const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, ".");
  return {
    id: `cu-${String(idx + 1).padStart(3, "0")}`,
    fullName: name,
    email: `${slug}@gmail.com`,
    phone: `+595 98${idx} ${String(100000 + idx * 137).slice(0, 6)}`,
    city: cities[idx % cities.length],
    country: "Paraguay",
    avatarUrl: `https://i.pravatar.cc/120?u=${slug}`,
    totalOrders,
    totalSpent,
    lastOrderAt: idx % 9 === 0 ? null : new Date(2026, 4, 1 + (idx % 25)).toISOString().slice(0, 10),
    tier,
    joinedAt: new Date(2025, idx % 12, 1 + (idx % 27)).toISOString().slice(0, 10),
  };
});

// ──────────────────────────────────────────────────────────────────────────
// PEDIDOS
// ──────────────────────────────────────────────────────────────────────────
const orderStatuses: MockOrderStatus[] = ["pending", "paid", "preparing", "shipped", "delivered", "cancelled"];

export const mockOrders: MockOrder[] = Array.from({ length: 42 }).map((_, idx) => {
  const customer = mockCustomers[idx % mockCustomers.length];
  const items = 1 + (idx % 4);
  const subtotal = items * (380_000 + (idx * 31_000) % 600_000);
  const shipping = idx % 3 === 0 ? 0 : 35_000;
  return {
    id: `or-${String(idx + 1).padStart(4, "0")}`,
    number: `MG-${String(2026000 + idx).padStart(7, "0")}`,
    customerId: customer.id,
    customerName: customer.fullName,
    customerEmail: customer.email,
    status: orderStatuses[idx % orderStatuses.length],
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    paymentMethod: (["card", "transfer", "cash"] as const)[idx % 3],
    createdAt: new Date(2026, 4, 1 + (idx % 27), 9 + (idx % 12), (idx * 7) % 60).toISOString(),
  };
});

// ──────────────────────────────────────────────────────────────────────────
// CUPONES
// ──────────────────────────────────────────────────────────────────────────
export const mockCoupons: MockCoupon[] = [
  { id: "cp-01", code: "BIENVENIDA10", description: "10% en primera compra", type: "percent", value: 10, minPurchase: 0, maxUses: 1000, uses: 342, startsAt: "2026-01-01", expiresAt: "2026-12-31", isActive: true },
  { id: "cp-02", code: "DIOR20", description: "20% en línea Dior", type: "percent", value: 20, minPurchase: 800_000, maxUses: 500, uses: 187, startsAt: "2026-04-01", expiresAt: "2026-06-30", isActive: true },
  { id: "cp-03", code: "GOLD50K", description: "Gs 50.000 OFF clientes Gold", type: "fixed", value: 50_000, minPurchase: 500_000, maxUses: 200, uses: 64, startsAt: "2026-05-01", expiresAt: "2026-07-31", isActive: true },
  { id: "cp-04", code: "ENVIOFREE", description: "Envío gratis a Asunción", type: "fixed", value: 35_000, minPurchase: 600_000, maxUses: 10000, uses: 4_213, startsAt: "2026-01-01", expiresAt: "2026-12-31", isActive: true },
  { id: "cp-05", code: "TOMFORD15", description: "15% en Tom Ford", type: "percent", value: 15, minPurchase: 1_200_000, maxUses: 300, uses: 89, startsAt: "2026-05-15", expiresAt: "2026-06-15", isActive: true },
  { id: "cp-06", code: "SANVALENTIN", description: "Cupón San Valentín 2026", type: "percent", value: 25, minPurchase: 400_000, maxUses: 800, uses: 800, startsAt: "2026-02-10", expiresAt: "2026-02-14", isActive: false },
  { id: "cp-07", code: "MAMA2026", description: "Día de la madre 2026", type: "percent", value: 18, minPurchase: 350_000, maxUses: 2000, uses: 1_245, startsAt: "2026-05-08", expiresAt: "2026-05-18", isActive: false },
  { id: "cp-08", code: "VIPONLY", description: "Exclusivo clientes Platinum", type: "percent", value: 30, minPurchase: 1_500_000, maxUses: 50, uses: 12, startsAt: "2026-05-20", expiresAt: "2026-08-31", isActive: true },
];

// ──────────────────────────────────────────────────────────────────────────
// USUARIOS ADMIN
// ──────────────────────────────────────────────────────────────────────────
export const mockAdminUsers: MockAdminUser[] = [
  { id: "au-01", fullName: "Maxi Guillen", email: "maxi@mgperfumeria.com", role: "owner", avatarUrl: "https://i.pravatar.cc/120?u=maxi", lastLoginAt: "2026-05-27T08:42:00Z", isActive: true, createdAt: "2025-09-01" },
  { id: "au-02", fullName: "Gabriela Martínez", email: "gabriela@mgperfumeria.com", role: "admin", avatarUrl: "https://i.pravatar.cc/120?u=gabriela", lastLoginAt: "2026-05-26T18:11:00Z", isActive: true, createdAt: "2025-10-12" },
  { id: "au-03", fullName: "Andrés López", email: "andres@mgperfumeria.com", role: "editor", avatarUrl: "https://i.pravatar.cc/120?u=andres", lastLoginAt: "2026-05-25T11:35:00Z", isActive: true, createdAt: "2025-11-04" },
  { id: "au-04", fullName: "Romina Sosa", email: "romina@mgperfumeria.com", role: "editor", avatarUrl: "https://i.pravatar.cc/120?u=romina", lastLoginAt: "2026-05-24T14:09:00Z", isActive: true, createdAt: "2026-01-18" },
  { id: "au-05", fullName: "Diego Pereira", email: "diego@mgperfumeria.com", role: "viewer", avatarUrl: "https://i.pravatar.cc/120?u=diego", lastLoginAt: "2026-04-30T09:22:00Z", isActive: false, createdAt: "2026-02-22" },
];

// ──────────────────────────────────────────────────────────────────────────
// MOVIMIENTOS INVENTARIO
// ──────────────────────────────────────────────────────────────────────────
const movementReasons = {
  in: ["Recepción de proveedor", "Reposición", "Devolución cliente", "Transferencia entrante"],
  out: ["Venta", "Muestra", "Pérdida", "Transferencia saliente"],
  adjust: ["Ajuste por inventario", "Corrección", "Producto vencido"],
} as const;

export const mockInventoryMovements: MockInventoryMovement[] = Array.from({ length: 60 }).map((_, idx) => {
  const product = mockProducts[idx % mockProducts.length];
  const type = (["in", "out", "out", "out", "adjust"] as const)[idx % 5];
  const reasons = movementReasons[type];
  const admin = mockAdminUsers[idx % mockAdminUsers.length];
  return {
    id: `mv-${String(idx + 1).padStart(4, "0")}`,
    productId: product.id,
    productName: product.name,
    brandName: product.brandName,
    type,
    quantity: type === "in" ? 5 + (idx % 25) : 1 + (idx % 6),
    reason: reasons[idx % reasons.length],
    user: admin.fullName,
    createdAt: new Date(2026, 4, 1 + (idx % 27), 8 + (idx % 12), (idx * 13) % 60).toISOString(),
  };
});

// ──────────────────────────────────────────────────────────────────────────
// DASHBOARD KPIs / SERIES
// ──────────────────────────────────────────────────────────────────────────
export type MockDashboard = {
  salesToday: number;
  salesMonth: number;
  totalRevenue: number;
  pendingOrders: number;
  customersCount: number;
  activeProducts: number;
  averageTicket: number;
  conversionRate: number;
  salesByMonth: { month: string; revenue: number; orders: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  topCategories: { name: string; value: number }[];
  revenueDistribution: { name: string; value: number }[];
};

export const mockDashboard: MockDashboard = {
  salesToday: 4_280_000,
  salesMonth: 142_650_000,
  totalRevenue: 1_487_320_000,
  pendingOrders: mockOrders.filter((o) => o.status === "pending" || o.status === "preparing").length,
  customersCount: mockCustomers.length + 384,
  activeProducts: mockProducts.filter((p) => p.isActive).length,
  averageTicket: 612_400,
  conversionRate: 3.84,
  salesByMonth: [
    { month: "Ene", revenue: 98_400_000, orders: 142 },
    { month: "Feb", revenue: 112_800_000, orders: 168 },
    { month: "Mar", revenue: 125_300_000, orders: 184 },
    { month: "Abr", revenue: 134_900_000, orders: 201 },
    { month: "May", revenue: 142_650_000, orders: 218 },
    { month: "Jun", revenue: 138_200_000, orders: 207 },
    { month: "Jul", revenue: 156_100_000, orders: 231 },
    { month: "Ago", revenue: 161_700_000, orders: 244 },
    { month: "Sep", revenue: 148_500_000, orders: 219 },
    { month: "Oct", revenue: 172_400_000, orders: 258 },
    { month: "Nov", revenue: 184_900_000, orders: 281 },
    { month: "Dic", revenue: 211_500_000, orders: 318 },
  ],
  topProducts: [
    { name: "Coco Mademoiselle", sold: 87, revenue: 41_240_000 },
    { name: "Sauvage Elixir", sold: 74, revenue: 38_120_000 },
    { name: "Black Opium", sold: 69, revenue: 32_800_000 },
    { name: "Good Girl Blush", sold: 58, revenue: 28_410_000 },
    { name: "Libre Intense", sold: 52, revenue: 24_700_000 },
    { name: "Bleu de Chanel", sold: 47, revenue: 22_980_000 },
  ],
  topCategories: [
    { name: "Eau de Parfum", value: 42 },
    { name: "Parfum", value: 24 },
    { name: "Eau de Toilette", value: 18 },
    { name: "Decants", value: 9 },
    { name: "Sets", value: 7 },
  ],
  revenueDistribution: [
    { name: "Femenino", value: 58 },
    { name: "Masculino", value: 32 },
    { name: "Unisex", value: 10 },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────────────
export function formatGs(value: number): string {
  return new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-PY").format(value);
}

export function formatDate(value: string | Date | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("es-PY", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("es-PY", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

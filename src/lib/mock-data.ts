import type { Category, Product } from "./catalog-types";

const img = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const categories: Category[] = [
  { slug: "tecnologia", name: "Tecnología", count: 128, icon: "Cpu" },
  { slug: "hogar", name: "Hogar", count: 96, icon: "Home" },
  { slug: "electrodomesticos", name: "Electrodomésticos", count: 74, icon: "Refrigerator" },
  { slug: "accesorios", name: "Accesorios", count: 152, icon: "Watch" },
  { slug: "herramientas", name: "Herramientas", count: 63, icon: "Wrench" },
  { slug: "moda", name: "Moda y uso diario", count: 110, icon: "Shirt" },
  { slug: "ofertas", name: "Ofertas", count: 45, icon: "Flame" },
  { slug: "nuevos", name: "Nuevos ingresos", count: 38, icon: "Sparkles" },
];

export const products: Product[] = [
  {
    id: "p1", name: "Auriculares Bluetooth Pro Max", price: 189000, oldPrice: 249000,
    rating: 4.8, reviews: 142, category: "tecnologia",
    image: img("1505740420928-5e560c06d30e"), badge: "Oferta", stock: 24,
    gallery: [img("1505740420928-5e560c06d30e"), img("1484704849700-f032a568e944"), img("1546435770-a3e426bf472b")],
    description: "Sonido envolvente con cancelación activa de ruido y batería de hasta 30 horas.",
    features: ["Bluetooth 5.3", "Cancelación de ruido", "Batería 30h", "Micrófono HD"],
  },
  {
    id: "p2", name: "Smartwatch Sport L&A", price: 349000, oldPrice: 429000,
    rating: 4.7, reviews: 89, category: "tecnologia",
    image: img("1546868871-7041f2a55e12"), badge: "Top venta", stock: 18,
    gallery: [img("1546868871-7041f2a55e12"), img("1523275335684-37898b6baf30"), img("1434493789847-2f02dc6ca35d")],
    description: "Pantalla AMOLED, monitor cardíaco y resistencia al agua. Tu coach personal en la muñeca.",
    features: ["AMOLED 1.4\"", "GPS integrado", "Sumergible 5ATM", "Notificaciones smart"],
  },
  {
    id: "p3", name: "Cafetera Express Premium", price: 1290000,
    rating: 4.9, reviews: 56, category: "electrodomesticos",
    image: img("1517668808822-9ebb02f2a0e6"), badge: "Nuevo", stock: 9,
    gallery: [img("1517668808822-9ebb02f2a0e6"), img("1495474472287-4d71bcdd2085"), img("1514432324607-a09d9b4aefdd")],
    description: "Café de barista en casa. 15 bares de presión y vaporizador profesional.",
    features: ["15 bares", "Vaporizador", "Depósito 1.8L", "Acero inox"],
  },
  {
    id: "p4", name: "Set de Herramientas 120 piezas", price: 459000, oldPrice: 599000,
    rating: 4.6, reviews: 203, category: "herramientas",
    image: img("1581094794329-c8112a89af12"), badge: "Oferta", stock: 31,
    gallery: [img("1581094794329-c8112a89af12"), img("1530124566582-a618bc2615dc"), img("1517048676732-d65bc937f952")],
    description: "Maletín completo para todo tipo de tareas. Acero cromo-vanadio.",
    features: ["120 piezas", "Cromo-vanadio", "Maletín rígido", "Garantía 1 año"],
  },
  {
    id: "p5", name: "Aspiradora Robot Inteligente", price: 1890000,
    rating: 4.8, reviews: 67, category: "hogar",
    image: img("1558317374-067fb5f30001"), badge: "Top venta", stock: 12,
    gallery: [img("1558317374-067fb5f30001"), img("1581578731548-c64695cc6952"), img("1527515637462-cff94eecc1ac")],
    description: "Mapeo láser, control por app y autonomía de hasta 150 minutos.",
    features: ["Mapeo láser", "App WiFi", "Autonomía 150min", "Modo silencioso"],
  },
  {
    id: "p6", name: "Mochila Urbana Anti-Robo", price: 219000,
    rating: 4.5, reviews: 178, category: "accesorios",
    image: img("1553062407-98eeb64c6a62"), badge: "Nuevo", stock: 40,
    gallery: [img("1553062407-98eeb64c6a62"), img("1547949003-9792a18a2601"), img("1622560480605-d83c853bc5c3")],
    description: "Diseño minimalista con puerto USB y bolsillo oculto para tu laptop.",
    features: ["Puerto USB", "Anti-robo", "Impermeable", "Laptop 15.6\""],
  },
  {
    id: "p7", name: "Parlante Bluetooth Boom 360°", price: 379000, oldPrice: 459000,
    rating: 4.7, reviews: 95, category: "tecnologia",
    image: img("1608043152269-423dbba4e7e1"), badge: "Oferta", stock: 22,
    gallery: [img("1608043152269-423dbba4e7e1"), img("1545454675-3531b543be5d"), img("1564424224827-cd24b8915874")],
    description: "Sonido 360° con graves potentes. Resistente al agua y polvo.",
    features: ["Sonido 360°", "IPX7", "Batería 24h", "TWS dual"],
  },
  {
    id: "p8", name: "Licuadora Profesional 2L", price: 549000,
    rating: 4.6, reviews: 134, category: "electrodomesticos",
    image: img("1570222094114-d054a817e56b"), stock: 17,
    gallery: [img("1570222094114-d054a817e56b"), img("1570197788417-0e82375c9371"), img("1585238342028-4bbc5c8a61b3")],
    description: "1500W de potencia con cuchillas de acero inoxidable. Tritura hielo sin esfuerzo.",
    features: ["1500W", "Jarra 2L", "6 velocidades", "Acero inox"],
  },
  {
    id: "p9", name: "Lámpara LED de Escritorio", price: 159000,
    rating: 4.4, reviews: 88, category: "hogar",
    image: img("1507473885765-e6ed057f782c"), badge: "Nuevo", stock: 55,
    gallery: [img("1507473885765-e6ed057f782c"), img("1494438639946-1ebd1d20bf85"), img("1513506003901-1e6a229e2d15")],
    description: "Luz ajustable en intensidad y color. Carga inalámbrica integrada.",
    features: ["Carga Qi", "3 tonos", "Touch control", "Brazo flexible"],
  },
  {
    id: "p10", name: "Reloj Clásico Cuero", price: 289000, oldPrice: 359000,
    rating: 4.7, reviews: 64, category: "accesorios",
    image: img("1524592094714-0f0654e20314"), badge: "Oferta", stock: 14,
    gallery: [img("1524592094714-0f0654e20314"), img("1434056886845-dac89ffe9b56"), img("1523170335258-f5ed11844a49")],
    description: "Diseño atemporal con correa de cuero genuino y movimiento de cuarzo.",
    features: ["Cuero genuino", "Cuarzo japonés", "Sumergible 3ATM", "Cristal mineral"],
  },
  {
    id: "p11", name: "Taladro Inalámbrico 20V", price: 689000,
    rating: 4.8, reviews: 156, category: "herramientas",
    image: img("1504148455328-c376907d081c"), badge: "Top venta", stock: 19,
    gallery: [img("1504148455328-c376907d081c"), img("1572981779307-38b8cabb2407"), img("1562259929-b4e1fd3aef09")],
    description: "Potencia profesional con dos baterías. Ideal para trabajos exigentes.",
    features: ["20V Li-ion", "2 baterías", "Maletín", "Cargador rápido"],
  },
  {
    id: "p12", name: "Zapatillas Urbanas Pro", price: 419000, oldPrice: 519000,
    rating: 4.6, reviews: 221, category: "moda",
    image: img("1542291026-7eec264c27ff"), badge: "Oferta", stock: 28,
    gallery: [img("1542291026-7eec264c27ff"), img("1549298916-b41d501d3772"), img("1491553895911-0055eca6402d")],
    description: "Comodidad todo el día con suela de máxima amortiguación.",
    features: ["Suela EVA", "Mesh transpirable", "Ultra livianas", "Diseño urbano"],
  },
];

export const testimonials = [
  { name: "Carolina M.", text: "Compré por WhatsApp y me atendieron súper rápido. Excelente experiencia.", rating: 5 },
  { name: "Diego R.", text: "Muy buenos productos y precios. La tienda se ve confiable y fácil de usar.", rating: 5 },
  { name: "Sofía P.", text: "Encontré justo lo que necesitaba. Recomendadísimo.", rating: 5 },
  { name: "Martín L.", text: "Envío rápido y todo llegó como en las fotos. Vuelvo a comprar seguro.", rating: 5 },
];

export const WHATSAPP_PHONE = "595981625726";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola L&A Multiventas")}`;

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(n);

export const createCheckoutWhatsAppUrl = (
  items: { product: Product; qty: number }[],
  shipping = 0,
  whatsappPhone = WHATSAPP_PHONE
) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0) + shipping;
  const lines = items.map(
    ({ product, qty }) => `- ${qty} x ${product.name}: ${formatPrice(product.price * qty)}`
  );
  const message = [
    "Hola L&A Multiventas, quiero finalizar esta compra:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
  ].filter(Boolean).join("\n");

  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
};

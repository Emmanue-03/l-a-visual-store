export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  gallery?: string[];
  badge?: "Oferta" | "Nuevo" | "Top venta";
  stock: number;
  description: string;
  features: string[];
};

const img = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const categories = [
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
    description: "Sonido envolvente con cancelación activa de ruido y batería de hasta 30 horas.",
    features: ["Bluetooth 5.3", "Cancelación de ruido", "Batería 30h", "Micrófono HD"],
  },
  {
    id: "p2", name: "Smartwatch Sport L&A", price: 349000, oldPrice: 429000,
    rating: 4.7, reviews: 89, category: "tecnologia",
    image: img("1546868871-7041f2a55e12"), badge: "Top venta", stock: 18,
    description: "Pantalla AMOLED, monitor cardíaco y resistencia al agua. Tu coach personal en la muñeca.",
    features: ["AMOLED 1.4\"", "GPS integrado", "Sumergible 5ATM", "Notificaciones smart"],
  },
  {
    id: "p3", name: "Cafetera Express Premium", price: 1290000,
    rating: 4.9, reviews: 56, category: "electrodomesticos",
    image: img("1517668808822-9ebb02f2a0e6"), badge: "Nuevo", stock: 9,
    description: "Café de barista en casa. 15 bares de presión y vaporizador profesional.",
    features: ["15 bares", "Vaporizador", "Depósito 1.8L", "Acero inox"],
  },
  {
    id: "p4", name: "Set de Herramientas 120 piezas", price: 459000, oldPrice: 599000,
    rating: 4.6, reviews: 203, category: "herramientas",
    image: img("1581094794329-c8112a89af12"), badge: "Oferta", stock: 31,
    description: "Maletín completo para todo tipo de tareas. Acero cromo-vanadio.",
    features: ["120 piezas", "Cromo-vanadio", "Maletín rígido", "Garantía 1 año"],
  },
  {
    id: "p5", name: "Aspiradora Robot Inteligente", price: 1890000,
    rating: 4.8, reviews: 67, category: "hogar",
    image: img("1558317374-067fb5f30001"), badge: "Top venta", stock: 12,
    description: "Mapeo láser, control por app y autonomía de hasta 150 minutos.",
    features: ["Mapeo láser", "App WiFi", "Autonomía 150min", "Modo silencioso"],
  },
  {
    id: "p6", name: "Mochila Urbana Anti-Robo", price: 219000,
    rating: 4.5, reviews: 178, category: "accesorios",
    image: img("1553062407-98eeb64c6a62"), badge: "Nuevo", stock: 40,
    description: "Diseño minimalista con puerto USB y bolsillo oculto para tu laptop.",
    features: ["Puerto USB", "Anti-robo", "Impermeable", "Laptop 15.6\""],
  },
  {
    id: "p7", name: "Parlante Bluetooth Boom 360°", price: 379000, oldPrice: 459000,
    rating: 4.7, reviews: 95, category: "tecnologia",
    image: img("1608043152269-423dbba4e7e1"), badge: "Oferta", stock: 22,
    description: "Sonido 360° con graves potentes. Resistente al agua y polvo.",
    features: ["Sonido 360°", "IPX7", "Batería 24h", "TWS dual"],
  },
  {
    id: "p8", name: "Licuadora Profesional 2L", price: 549000,
    rating: 4.6, reviews: 134, category: "electrodomesticos",
    image: img("1570222094114-d054a817e56b"), stock: 17,
    description: "1500W de potencia con cuchillas de acero inoxidable. Tritura hielo sin esfuerzo.",
    features: ["1500W", "Jarra 2L", "6 velocidades", "Acero inox"],
  },
  {
    id: "p9", name: "Lámpara LED de Escritorio", price: 159000,
    rating: 4.4, reviews: 88, category: "hogar",
    image: img("1507473885765-e6ed057f782c"), badge: "Nuevo", stock: 55,
    description: "Luz ajustable en intensidad y color. Carga inalámbrica integrada.",
    features: ["Carga Qi", "3 tonos", "Touch control", "Brazo flexible"],
  },
  {
    id: "p10", name: "Reloj Clásico Cuero", price: 289000, oldPrice: 359000,
    rating: 4.7, reviews: 64, category: "accesorios",
    image: img("1524592094714-0f0654e20314"), badge: "Oferta", stock: 14,
    description: "Diseño atemporal con correa de cuero genuino y movimiento de cuarzo.",
    features: ["Cuero genuino", "Cuarzo japonés", "Sumergible 3ATM", "Cristal mineral"],
  },
  {
    id: "p11", name: "Taladro Inalámbrico 20V", price: 689000,
    rating: 4.8, reviews: 156, category: "herramientas",
    image: img("1504148455328-c376907d081c"), badge: "Top venta", stock: 19,
    description: "Potencia profesional con dos baterías. Ideal para trabajos exigentes.",
    features: ["20V Li-ion", "2 baterías", "Maletín", "Cargador rápido"],
  },
  {
    id: "p12", name: "Zapatillas Urbanas Pro", price: 419000, oldPrice: 519000,
    rating: 4.6, reviews: 221, category: "moda",
    image: img("1542291026-7eec264c27ff"), badge: "Oferta", stock: 28,
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
  shipping = 0
) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const total = subtotal + shipping;
  const lines = items.map(
    ({ product, qty }) => `- ${qty} x ${product.name}: ${formatPrice(product.price * qty)}`
  );
  const message = [
    "Hola L&A Multiventas, quiero finalizar esta compra:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    shipping > 0 ? `Envio estimado: ${formatPrice(shipping)}` : null,
    `Total: ${formatPrice(total)}`,
  ].filter(Boolean).join("\n");

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

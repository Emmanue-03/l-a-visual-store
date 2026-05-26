export const lamultiventasSeedStatements = [
  `INSERT INTO lamultiventas.categories (slug, name, description, icon, sort_order, is_featured, is_active)
VALUES
  ('tecnologia', 'Tecnologia', 'Productos de tecnologia, audio y gadgets.', 'Cpu', 10, true, true),
  ('hogar', 'Hogar', 'Productos utiles para el hogar.', 'Home', 20, true, true),
  ('electrodomesticos', 'Electrodomesticos', 'Electrodomesticos seleccionados.', 'Refrigerator', 30, true, true),
  ('accesorios', 'Accesorios', 'Accesorios de uso diario.', 'Watch', 40, true, true),
  ('herramientas', 'Herramientas', 'Herramientas para trabajo y mantenimiento.', 'Wrench', 50, true, true),
  ('moda', 'Moda y uso diario', 'Moda, calzados y articulos diarios.', 'Shirt', 60, true, true),
  ('ofertas', 'Ofertas', 'Productos con precio especial.', 'Flame', 70, false, true),
  ('nuevos', 'Nuevos ingresos', 'Productos recientemente agregados.', 'Sparkles', 80, false, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;`,
  `INSERT INTO lamultiventas.site_settings (key, value, description)
VALUES
  ('store_name', to_jsonb('L&A Multiventas'::text), 'Nombre publico de la tienda'),
  ('whatsapp_phone', to_jsonb('595975484333'::text), 'Telefono WhatsApp en formato internacional sin +'),
  ('currency', to_jsonb('PYG'::text), 'Moneda principal'),
  ('default_shipping_cost', to_jsonb(25000), 'Costo de envio por defecto'),
  ('seo_title', to_jsonb('L&A Multiventas | Tu multitienda online de confianza'::text), 'Titulo SEO principal'),
  ('seo_description', to_jsonb('Compra facil, rapido y seguro en L&A Multiventas.'::text), 'Descripcion SEO principal')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;`,
  `INSERT INTO lamultiventas.products (
  slug, name, description, category_id, price, old_price, rating, reviews_count, badge, stock,
  image_url, gallery_urls, features, is_active, is_featured, is_best_seller, is_new_arrival, sort_order
)
VALUES
  (
    'auriculares-bluetooth-pro-max',
    'Auriculares Bluetooth Pro Max',
    'Sonido envolvente con cancelacion activa de ruido y bateria de hasta 30 horas.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'tecnologia'),
    189000, 249000, 4.8, 142, 'Oferta', 24,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['Bluetooth 5.3', 'Cancelacion de ruido', 'Bateria 30h', 'Microfono HD'],
    true, true, false, false, 10
  ),
  (
    'smartwatch-sport-la',
    'Smartwatch Sport L&A',
    'Pantalla AMOLED, monitor cardiaco y resistencia al agua. Tu coach personal en la muñeca.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'tecnologia'),
    349000, 429000, 4.7, 89, 'Top venta', 18,
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['AMOLED 1.4"', 'GPS integrado', 'Sumergible 5ATM', 'Notificaciones smart'],
    true, true, true, false, 20
  ),
  (
    'cafetera-express-premium',
    'Cafetera Express Premium',
    'Cafe de barista en casa. 15 bares de presion y vaporizador profesional.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'electrodomesticos'),
    1290000, NULL, 4.9, 56, 'Nuevo', 9,
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['15 bares', 'Vaporizador', 'Deposito 1.8L', 'Acero inox'],
    true, true, false, true, 30
  ),
  (
    'set-de-herramientas-120-piezas',
    'Set de Herramientas 120 piezas',
    'Maletin completo para todo tipo de tareas. Acero cromo-vanadio.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'herramientas'),
    459000, 599000, 4.6, 203, 'Oferta', 31,
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['120 piezas', 'Cromo-vanadio', 'Maletin rigido', 'Garantia 1 año'],
    true, true, false, false, 40
  ),
  (
    'aspiradora-robot-inteligente',
    'Aspiradora Robot Inteligente',
    'Mapeo laser, control por app y autonomia de hasta 150 minutos.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'hogar'),
    1890000, NULL, 4.8, 67, 'Top venta', 12,
    'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['Mapeo laser', 'App WiFi', 'Autonomia 150min', 'Modo silencioso'],
    true, true, true, false, 50
  ),
  (
    'mochila-urbana-anti-robo',
    'Mochila Urbana Anti-Robo',
    'Diseño minimalista con puerto USB y bolsillo oculto para tu laptop.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'accesorios'),
    219000, NULL, 4.5, 178, 'Nuevo', 40,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['Puerto USB', 'Anti-robo', 'Impermeable', 'Laptop 15.6"'],
    true, true, false, true, 60
  ),
  (
    'parlante-bluetooth-boom-360',
    'Parlante Bluetooth Boom 360',
    'Sonido 360 con graves potentes. Resistente al agua y polvo.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'tecnologia'),
    379000, 459000, 4.7, 95, 'Oferta', 22,
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1564424224827-cd24b8915874?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['Sonido 360', 'IPX7', 'Bateria 24h', 'TWS dual'],
    true, false, false, false, 70
  ),
  (
    'licuadora-profesional-2l',
    'Licuadora Profesional 2L',
    '1500W de potencia con cuchillas de acero inoxidable. Tritura hielo sin esfuerzo.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'electrodomesticos'),
    549000, NULL, 4.6, 134, NULL, 17,
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1585238342028-4bbc5c8a61b3?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['1500W', 'Jarra 2L', '6 velocidades', 'Acero inox'],
    true, false, false, false, 80
  ),
  (
    'lampara-led-de-escritorio',
    'Lampara LED de Escritorio',
    'Luz ajustable en intensidad y color. Carga inalambrica integrada.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'hogar'),
    159000, NULL, 4.4, 88, 'Nuevo', 55,
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['Carga Qi', '3 tonos', 'Touch control', 'Brazo flexible'],
    true, false, false, true, 90
  ),
  (
    'reloj-clasico-cuero',
    'Reloj Clasico Cuero',
    'Diseño atemporal con correa de cuero genuino y movimiento de cuarzo.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'accesorios'),
    289000, 359000, 4.7, 64, 'Oferta', 14,
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['Cuero genuino', 'Cuarzo japones', 'Sumergible 3ATM', 'Cristal mineral'],
    true, false, false, false, 100
  ),
  (
    'taladro-inalambrico-20v',
    'Taladro Inalambrico 20V',
    'Potencia profesional con dos baterias. Ideal para trabajos exigentes.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'herramientas'),
    689000, NULL, 4.8, 156, 'Top venta', 19,
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['20V Li-ion', '2 baterias', 'Maletin', 'Cargador rapido'],
    true, false, true, false, 110
  ),
  (
    'zapatillas-urbanas-pro',
    'Zapatillas Urbanas Pro',
    'Comodidad todo el dia con suela de maxima amortiguacion.',
    (SELECT id FROM lamultiventas.categories WHERE slug = 'moda'),
    419000, 519000, 4.6, 221, 'Oferta', 28,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    ARRAY['Suela EVA', 'Mesh transpirable', 'Ultra livianas', 'Diseño urbano'],
    true, false, false, false, 120
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  price = EXCLUDED.price,
  old_price = EXCLUDED.old_price,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  badge = EXCLUDED.badge,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  gallery_urls = EXCLUDED.gallery_urls,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  is_best_seller = EXCLUDED.is_best_seller,
  is_new_arrival = EXCLUDED.is_new_arrival,
  sort_order = EXCLUDED.sort_order;`,
] as const;

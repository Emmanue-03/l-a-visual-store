export const lamultiventasSchemaStatements = [
  `CREATE SCHEMA IF NOT EXISTS lamultiventas;`,
  `CREATE EXTENSION IF NOT EXISTS pgcrypto;`,
  `CREATE OR REPLACE FUNCTION lamultiventas.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;`,
  `CREATE TABLE IF NOT EXISTS lamultiventas.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'admin',
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT admin_users_role_check CHECK (role IN ('admin', 'editor')),
  CONSTRAINT admin_users_email_lower_check CHECK (email = lower(email))
);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_lower_unique ON lamultiventas.admin_users (lower(email));`,
  `CREATE TABLE IF NOT EXISTS lamultiventas.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);`,
  `CREATE TABLE IF NOT EXISTS lamultiventas.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  short_description text,
  category_id uuid REFERENCES lamultiventas.categories(id),
  price integer NOT NULL,
  old_price integer,
  cost_price integer,
  currency text DEFAULT 'PYG',
  rating numeric(2,1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  badge text,
  stock integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 5,
  image_url text NOT NULL,
  gallery_urls text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  is_new_arrival boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT products_price_check CHECK (price > 0),
  CONSTRAINT products_old_price_check CHECK (old_price IS NULL OR old_price > price),
  CONSTRAINT products_stock_check CHECK (stock >= 0),
  CONSTRAINT products_badge_check CHECK (badge IS NULL OR badge IN ('Oferta', 'Nuevo', 'Top venta'))
);`,
  `CREATE TABLE IF NOT EXISTS lamultiventas.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text,
  customer_phone text,
  customer_email text,
  customer_address text,
  status text DEFAULT 'pending',
  subtotal integer DEFAULT 0,
  shipping_cost integer DEFAULT 0,
  total integer DEFAULT 0,
  source text DEFAULT 'web',
  whatsapp_message text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT orders_status_check CHECK (status IN ('draft', 'pending', 'confirmed', 'paid', 'cancelled', 'delivered'))
);`,
  `CREATE TABLE IF NOT EXISTS lamultiventas.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES lamultiventas.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES lamultiventas.products(id),
  product_snapshot jsonb NOT NULL,
  qty integer NOT NULL,
  unit_price integer NOT NULL,
  total integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT order_items_qty_check CHECK (qty > 0),
  CONSTRAINT order_items_unit_price_check CHECK (unit_price >= 0),
  CONSTRAINT order_items_total_check CHECK (total >= 0)
);`,
  `CREATE TABLE IF NOT EXISTS lamultiventas.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);`,
  `CREATE TABLE IF NOT EXISTS lamultiventas.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES lamultiventas.admin_users(id),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  ip text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);`,
  `DROP TRIGGER IF EXISTS admin_users_set_updated_at ON lamultiventas.admin_users;
CREATE TRIGGER admin_users_set_updated_at BEFORE UPDATE ON lamultiventas.admin_users
FOR EACH ROW EXECUTE FUNCTION lamultiventas.set_updated_at();`,
  `DROP TRIGGER IF EXISTS categories_set_updated_at ON lamultiventas.categories;
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON lamultiventas.categories
FOR EACH ROW EXECUTE FUNCTION lamultiventas.set_updated_at();`,
  `DROP TRIGGER IF EXISTS products_set_updated_at ON lamultiventas.products;
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON lamultiventas.products
FOR EACH ROW EXECUTE FUNCTION lamultiventas.set_updated_at();`,
  `DROP TRIGGER IF EXISTS orders_set_updated_at ON lamultiventas.orders;
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON lamultiventas.orders
FOR EACH ROW EXECUTE FUNCTION lamultiventas.set_updated_at();`,
  `DROP TRIGGER IF EXISTS site_settings_set_updated_at ON lamultiventas.site_settings;
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON lamultiventas.site_settings
FOR EACH ROW EXECUTE FUNCTION lamultiventas.set_updated_at();`,
  `CREATE INDEX IF NOT EXISTS categories_slug_idx ON lamultiventas.categories (slug);`,
  `CREATE INDEX IF NOT EXISTS categories_is_active_idx ON lamultiventas.categories (is_active);`,
  `CREATE INDEX IF NOT EXISTS categories_is_featured_idx ON lamultiventas.categories (is_featured);`,
  `CREATE INDEX IF NOT EXISTS products_slug_idx ON lamultiventas.products (slug);`,
  `CREATE INDEX IF NOT EXISTS products_category_id_idx ON lamultiventas.products (category_id);`,
  `CREATE INDEX IF NOT EXISTS products_is_active_idx ON lamultiventas.products (is_active);`,
  `CREATE INDEX IF NOT EXISTS products_is_featured_idx ON lamultiventas.products (is_featured);`,
  `CREATE INDEX IF NOT EXISTS products_is_best_seller_idx ON lamultiventas.products (is_best_seller);`,
  `CREATE INDEX IF NOT EXISTS products_is_new_arrival_idx ON lamultiventas.products (is_new_arrival);`,
  `CREATE INDEX IF NOT EXISTS products_stock_idx ON lamultiventas.products (stock);`,
  `CREATE INDEX IF NOT EXISTS products_created_at_idx ON lamultiventas.products (created_at);`,
  `CREATE INDEX IF NOT EXISTS orders_status_idx ON lamultiventas.orders (status);`,
  `CREATE INDEX IF NOT EXISTS orders_created_at_idx ON lamultiventas.orders (created_at);`,
  `CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON lamultiventas.order_items (order_id);`,
  `CREATE OR REPLACE VIEW lamultiventas.active_products AS
SELECT
  p.*,
  c.slug AS category_slug,
  c.name AS category_name,
  c.icon AS category_icon
FROM lamultiventas.products p
LEFT JOIN lamultiventas.categories c ON c.id = p.category_id
WHERE p.is_active = true AND COALESCE(c.is_active, true) = true;`,
] as const;

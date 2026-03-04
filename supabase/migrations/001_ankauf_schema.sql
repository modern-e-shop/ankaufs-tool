-- Produktkatalog
CREATE TABLE product_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE product_subcategory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type_id UUID REFERENCES product_type(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID REFERENCES product_subcategory(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ankaufs-Vorgänge
CREATE TYPE buyback_status AS ENUM (
  'pending', 'reviewing', 'confirmed', 'shipped', 'received', 'paid', 'rejected'
);

CREATE TYPE payment_method AS ENUM ('bank_transfer', 'paypal');

CREATE TABLE buyback_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status buyback_status DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  payment_method payment_method NOT NULL,
  payment_details JSONB NOT NULL,
  seller_name TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE buyback_order_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES buyback_order(id) ON DELETE CASCADE,
  product_id UUID REFERENCES product(id),
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_product_subcategory ON product(subcategory_id);
CREATE INDEX idx_buyback_order_status ON buyback_order(status);
CREATE INDEX idx_buyback_order_item_order ON buyback_order_item(order_id);

-- Updated_at Trigger
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_updated_at BEFORE UPDATE ON product FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER buyback_order_updated_at BEFORE UPDATE ON buyback_order FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE product_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_subcategory ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyback_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyback_order_item ENABLE ROW LEVEL SECURITY;

-- Public read für Katalog
CREATE POLICY "Katalog lesbar" ON product_type FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Unterkategorien lesbar" ON product_subcategory FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Produkte lesbar" ON product FOR SELECT TO anon, authenticated USING (active = true);

-- Jeder kann Orders erstellen
CREATE POLICY "Orders erstellen" ON buyback_order FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Order Items erstellen" ON buyback_order_item FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Nur authenticated (Admin) kann Orders lesen/ändern
CREATE POLICY "Orders admin lesen" ON buyback_order FOR SELECT TO authenticated USING (true);
CREATE POLICY "Orders admin ändern" ON buyback_order FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Order Items admin lesen" ON buyback_order_item FOR SELECT TO authenticated USING (true);

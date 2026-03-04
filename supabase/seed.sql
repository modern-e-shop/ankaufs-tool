-- Seed: Produktkatalog für Ankaufs-Tool
-- ==========================================

-- Kategorien
INSERT INTO product_type (id, name, icon, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Skylanders', '🎮', 1),
  ('11111111-0000-0000-0000-000000000002', 'Kameras', '📷', 2);

-- Unterkategorien: Skylanders
INSERT INTO product_subcategory (id, product_type_id, name, slug, sort_order) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Spyro''s Adventure', 'spyros_adventure', 1),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Giants', 'giants', 2),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Swap Force', 'swap_force', 3),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'Trap Team', 'trap_team', 4),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', 'SuperChargers', 'superchargers', 5),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000001', 'Imaginators', 'imaginators', 6);

-- Unterkategorien: Kameras
INSERT INTO product_subcategory (id, product_type_id, name, slug, sort_order) VALUES
  ('22222222-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000002', 'Klappkameras', 'klappkameras', 1),
  ('22222222-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000002', 'Spiegelreflexkameras', 'spiegelreflex', 2),
  ('22222222-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000002', 'Sofortbildkameras', 'sofortbild', 3);

-- Produkte: Spyro's Adventure
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Spyro', 8.50),
  ('22222222-0000-0000-0000-000000000001', 'Trigger Happy', 5.00),
  ('22222222-0000-0000-0000-000000000001', 'Gill Grunt', 4.50),
  ('22222222-0000-0000-0000-000000000001', 'Stealth Elf', 6.00),
  ('22222222-0000-0000-0000-000000000001', 'Eruptor', 5.50);

-- Produkte: Giants
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000002', 'Tree Rex', 12.00),
  ('22222222-0000-0000-0000-000000000002', 'Crusher', 10.00),
  ('22222222-0000-0000-0000-000000000002', 'Bouncer', 11.00),
  ('22222222-0000-0000-0000-000000000002', 'Hot Head', 9.50);

-- Produkte: Swap Force
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000003', 'Magna Charge', 7.00),
  ('22222222-0000-0000-0000-000000000003', 'Wash Buckler', 8.00),
  ('22222222-0000-0000-0000-000000000003', 'Blast Zone', 6.50),
  ('22222222-0000-0000-0000-000000000003', 'Night Shift', 7.50);

-- Produkte: Trap Team
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000004', 'Snap Shot', 6.00),
  ('22222222-0000-0000-0000-000000000004', 'Food Fight', 4.00),
  ('22222222-0000-0000-0000-000000000004', 'Wallop', 5.50);

-- Produkte: SuperChargers
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000005', 'Spitfire', 7.00),
  ('22222222-0000-0000-0000-000000000005', 'Stormblade', 6.00);

-- Produkte: Imaginators
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000006', 'King Pen', 8.00),
  ('22222222-0000-0000-0000-000000000006', 'Golden Queen', 9.00);

-- Produkte: Klappkameras
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000010', 'Olympus mju II', 85.00),
  ('22222222-0000-0000-0000-000000000010', 'Contax T2', 450.00),
  ('22222222-0000-0000-0000-000000000010', 'Ricoh GR1', 280.00);

-- Produkte: Spiegelreflexkameras
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000011', 'Canon AE-1', 120.00),
  ('22222222-0000-0000-0000-000000000011', 'Nikon FM2', 180.00),
  ('22222222-0000-0000-0000-000000000011', 'Pentax K1000', 95.00);

-- Produkte: Sofortbildkameras
INSERT INTO product (subcategory_id, name, price) VALUES
  ('22222222-0000-0000-0000-000000000012', 'Polaroid SX-70', 150.00),
  ('22222222-0000-0000-0000-000000000012', 'Instax Mini 90', 60.00);

-- Seed canonical caps for categories 3,4,5 and durations 8,15,22,29, both room types
INSERT INTO public.price_caps (category, duration_days, room_type, max_price_usd)
VALUES
  -- 3-star
  (3,29,'double',2000), (3,29,'single',1500),
  (3,22,'double',1600), (3,22,'single',1200),
  (3,15,'double',1100), (3,15,'single',850),
  (3,8,'double',600),   (3,8,'single',450),
  -- 4-star
  (4,29,'double',2750), (4,29,'single',2050),
  (4,22,'double',2200), (4,22,'single',1650),
  (4,15,'double',1600), (4,15,'single',1150),
  (4,8,'double',850),   (4,8,'single',600),
  -- 5-star
  (5,29,'double',3700), (5,29,'single',2700),
  (5,22,'double',3000), (5,22,'single',2200),
  (5,15,'double',2100), (5,15,'single',1500),
  (5,8,'double',1300),  (5,8,'single',800)
ON CONFLICT (category, duration_days, room_type)
DO UPDATE SET max_price_usd = EXCLUDED.max_price_usd;
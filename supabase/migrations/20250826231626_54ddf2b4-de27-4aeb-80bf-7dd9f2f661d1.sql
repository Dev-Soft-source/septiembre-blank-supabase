-- Fix RLS policies for hotel filtering
-- 1. Allow public access to hotel_themes for filtering
DROP POLICY IF EXISTS "Public read access for approved hotel themes" ON hotel_themes;
CREATE POLICY "Public read access for approved hotel themes"
ON hotel_themes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM hotels 
    WHERE hotels.id = hotel_themes.hotel_id 
    AND hotels.status = 'approved'
  )
);

-- 2. Allow public access to hotel_activities for filtering  
DROP POLICY IF EXISTS "Public read access for approved hotel activities" ON hotel_activities;
CREATE POLICY "Public read access for approved hotel activities"
ON hotel_activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM hotels 
    WHERE hotels.id = hotel_activities.hotel_id 
    AND hotels.status = 'approved'
  )
);

-- 3. Create a comprehensive view for hotel filtering that includes all necessary data
CREATE OR REPLACE VIEW hotels_with_filters_view AS
SELECT 
  h.*,
  COALESCE(
    array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL),
    '{}'::text[]
  ) as theme_names,
  COALESCE(
    array_agg(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), 
    '{}'::text[]
  ) as activity_names,
  COALESCE(
    array_agg(DISTINCT ht.theme_id) FILTER (WHERE ht.theme_id IS NOT NULL),
    '{}'::uuid[]
  ) as theme_ids,
  COALESCE(
    array_agg(DISTINCT ha.activity_id) FILTER (WHERE ha.activity_id IS NOT NULL),
    '{}'::uuid[]
  ) as activity_ids
FROM hotels h
LEFT JOIN hotel_themes ht ON h.id = ht.hotel_id
LEFT JOIN themes t ON ht.theme_id = t.id  
LEFT JOIN hotel_activities ha ON h.id = ha.hotel_id
LEFT JOIN activities a ON ha.activity_id = a.id
WHERE h.status = 'approved'
GROUP BY h.id;

-- Grant public access to the filtering view
GRANT SELECT ON hotels_with_filters_view TO anon;
GRANT SELECT ON hotels_with_filters_view TO authenticated;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotel_themes_hotel_status ON hotel_themes(hotel_id) 
WHERE EXISTS (SELECT 1 FROM hotels WHERE hotels.id = hotel_themes.hotel_id AND hotels.status = 'approved');

CREATE INDEX IF NOT EXISTS idx_hotel_activities_hotel_status ON hotel_activities(hotel_id)
WHERE EXISTS (SELECT 1 FROM hotels WHERE hotels.id = hotel_activities.hotel_id AND hotels.status = 'approved');

-- 5. Normalize activity names to ensure consistency for filtering
-- Create a function to normalize activity names for filtering
CREATE OR REPLACE FUNCTION normalize_activity_name(activity_name text)
RETURNS text
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN activity_name = 'Baile Bachata' THEN 'bachata_dancing'
    WHEN activity_name = 'Baile Clásico' THEN 'classical_dancing'
    WHEN activity_name = 'Baile de Salón' THEN 'ballroom_dancing'
    WHEN activity_name = 'Baile Rock & Roll' THEN 'rock_roll_dancing'
    WHEN activity_name = 'Baile Salsa' THEN 'salsa_dancing'
    WHEN activity_name = 'Baile Tango' THEN 'tango_dancing'
    WHEN activity_name = 'Ballet & Danza' THEN 'ballet_dance'
    WHEN activity_name = 'Yoga Relax' THEN 'relaxing_yoga'
    WHEN activity_name = 'Taller Cocina Española' THEN 'spanish_cooking_workshop'
    WHEN activity_name = 'Senderismo' THEN 'hiking'
    WHEN activity_name = 'Spa & Masaje' THEN 'spa_massage'
    WHEN activity_name = 'Cata de Vinos' THEN 'wine_tasting'
    WHEN activity_name = 'Fitness' THEN 'fitness'
    WHEN activity_name = 'Meditación' THEN 'meditation'
    WHEN activity_name = 'Música en Vivo' THEN 'live_music'
    ELSE lower(regexp_replace(regexp_replace(activity_name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '_', 'g'))
  END;
$$;
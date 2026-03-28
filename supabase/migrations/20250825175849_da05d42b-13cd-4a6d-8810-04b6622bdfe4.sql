-- Ensure all hotels have exactly 2 affinities and 3 activities

-- First, let's check which hotels are missing affinities
WITH hotel_affinity_counts AS (
  SELECT 
    h.id,
    h.name,
    COUNT(DISTINCT ht.theme_id) as current_affinities
  FROM hotels h
  LEFT JOIN hotel_themes ht ON h.id = ht.hotel_id
  WHERE h.status = 'approved'
  GROUP BY h.id, h.name
),
available_themes AS (
  SELECT id, name FROM themes WHERE level = 1 ORDER BY name
),
hotels_needing_affinities AS (
  SELECT * FROM hotel_affinity_counts WHERE current_affinities < 2
)

-- Insert missing affinities for hotels that have less than 2
INSERT INTO hotel_themes (hotel_id, theme_id)
SELECT DISTINCT 
  h.id,
  t.id
FROM hotels_needing_affinities h
CROSS JOIN available_themes t
WHERE NOT EXISTS (
  SELECT 1 FROM hotel_themes ht 
  WHERE ht.hotel_id = h.id AND ht.theme_id = t.id
)
AND (
  SELECT COUNT(*) FROM hotel_themes ht2 
  WHERE ht2.hotel_id = h.id
) < 2
ORDER BY h.id, RANDOM()
LIMIT 2 * (SELECT COUNT(*) FROM hotels_needing_affinities WHERE current_affinities = 0)
     + 1 * (SELECT COUNT(*) FROM hotels_needing_affinities WHERE current_affinities = 1);

-- Now ensure all hotels have exactly 3 activities
WITH hotel_activity_counts AS (
  SELECT 
    h.id,
    h.name,
    COUNT(DISTINCT ha.activity_id) as current_activities
  FROM hotels h
  LEFT JOIN hotel_activities ha ON h.id = ha.hotel_id
  WHERE h.status = 'approved'
  GROUP BY h.id, h.name
),
available_activities AS (
  SELECT id, name FROM activities ORDER BY name
),
hotels_needing_activities AS (
  SELECT * FROM hotel_activity_counts WHERE current_activities < 3
)

-- Insert missing activities for hotels that have less than 3
INSERT INTO hotel_activities (hotel_id, activity_id)
SELECT DISTINCT 
  h.id,
  a.id
FROM hotels_needing_activities h
CROSS JOIN available_activities a
WHERE NOT EXISTS (
  SELECT 1 FROM hotel_activities ha 
  WHERE ha.hotel_id = h.id AND ha.activity_id = a.id
)
AND (
  SELECT COUNT(*) FROM hotel_activities ha2 
  WHERE ha2.hotel_id = h.id
) < 3
ORDER BY h.id, RANDOM()
LIMIT 3 * (SELECT COUNT(*) FROM hotels_needing_activities WHERE current_activities = 0)
     + 2 * (SELECT COUNT(*) FROM hotels_needing_activities WHERE current_activities = 1)
     + 1 * (SELECT COUNT(*) FROM hotels_needing_activities WHERE current_activities = 2);
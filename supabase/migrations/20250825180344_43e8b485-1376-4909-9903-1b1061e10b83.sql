-- Simpler approach: Insert affinities and activities one by one for hotels that need them

-- First, create a function to assign random themes to a hotel
CREATE OR REPLACE FUNCTION assign_random_affinities_to_hotel(hotel_id_param UUID, count_needed INTEGER)
RETURNS VOID AS $$
DECLARE
    theme_record RECORD;
    assigned_count INTEGER := 0;
BEGIN
    -- Get random themes that aren't already assigned to this hotel
    FOR theme_record IN
        SELECT t.id
        FROM themes t
        WHERE t.level = 1
        AND NOT EXISTS (
            SELECT 1 FROM hotel_themes ht 
            WHERE ht.hotel_id = hotel_id_param AND ht.theme_id = t.id
        )
        ORDER BY RANDOM()
        LIMIT count_needed
    LOOP
        INSERT INTO hotel_themes (hotel_id, theme_id)
        VALUES (hotel_id_param, theme_record.id)
        ON CONFLICT DO NOTHING;
        assigned_count := assigned_count + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to assign random activities to a hotel
CREATE OR REPLACE FUNCTION assign_random_activities_to_hotel(hotel_id_param UUID, count_needed INTEGER)
RETURNS VOID AS $$
DECLARE
    activity_record RECORD;
    assigned_count INTEGER := 0;
BEGIN
    -- Get random activities that aren't already assigned to this hotel
    FOR activity_record IN
        SELECT a.id
        FROM activities a
        WHERE NOT EXISTS (
            SELECT 1 FROM hotel_activities ha 
            WHERE ha.hotel_id = hotel_id_param AND ha.activity_id = a.id
        )
        ORDER BY RANDOM()
        LIMIT count_needed
    LOOP
        INSERT INTO hotel_activities (hotel_id, activity_id)
        VALUES (hotel_id_param, activity_record.id)
        ON CONFLICT DO NOTHING;
        assigned_count := assigned_count + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
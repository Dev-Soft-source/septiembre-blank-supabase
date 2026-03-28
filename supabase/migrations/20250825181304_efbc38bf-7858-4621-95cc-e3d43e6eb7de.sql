-- Now use the functions to assign missing affinities and activities to all hotels

-- First, assign affinities to hotels that have less than 2
DO $$
DECLARE
    hotel_record RECORD;
    current_affinity_count INTEGER;
    affinities_needed INTEGER;
BEGIN
    FOR hotel_record IN
        SELECT 
            h.id,
            h.name,
            COUNT(DISTINCT ht.theme_id) as current_affinities
        FROM hotels h
        LEFT JOIN hotel_themes ht ON h.id = ht.hotel_id
        WHERE h.status = 'approved'
        GROUP BY h.id, h.name
        HAVING COUNT(DISTINCT ht.theme_id) < 2
    LOOP
        current_affinity_count := hotel_record.current_affinities;
        affinities_needed := 2 - current_affinity_count;
        
        RAISE NOTICE 'Assigning % affinities to hotel: %', affinities_needed, hotel_record.name;
        
        -- Call the function to assign random affinities
        PERFORM assign_random_affinities_to_hotel(hotel_record.id, affinities_needed);
    END LOOP;
END;
$$;

-- Then, assign activities to hotels that have less than 3
DO $$
DECLARE
    hotel_record RECORD;
    current_activity_count INTEGER;
    activities_needed INTEGER;
BEGIN
    FOR hotel_record IN
        SELECT 
            h.id,
            h.name,
            COUNT(DISTINCT ha.activity_id) as current_activities
        FROM hotels h
        LEFT JOIN hotel_activities ha ON h.id = ha.hotel_id
        WHERE h.status = 'approved'
        GROUP BY h.id, h.name
        HAVING COUNT(DISTINCT ha.activity_id) < 3
    LOOP
        current_activity_count := hotel_record.current_activities;
        activities_needed := 3 - current_activity_count;
        
        RAISE NOTICE 'Assigning % activities to hotel: %', activities_needed, hotel_record.name;
        
        -- Call the function to assign random activities
        PERFORM assign_random_activities_to_hotel(hotel_record.id, activities_needed);
    END LOOP;
END;
$$;
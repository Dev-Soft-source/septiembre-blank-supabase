-- Insert hotel images for the demo hotels
DO $$
DECLARE
    hotel_rec RECORD;
    image_urls TEXT[];
BEGIN
    -- Loop through all hotels and add images
    FOR hotel_rec IN 
        SELECT id, name FROM hotels WHERE status = 'approved' ORDER BY created_at LIMIT 5
    LOOP
        -- Set different images for each hotel
        CASE 
            WHEN hotel_rec.name = 'Coastal Breeze Inn' THEN
                image_urls := ARRAY[
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'
                ];
            WHEN hotel_rec.name = 'Mountain View Lodge' THEN
                image_urls := ARRAY[
                    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'
                ];
            WHEN hotel_rec.name = 'Historic Charleston Inn' THEN
                image_urls := ARRAY[
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
                    'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
                ];
            WHEN hotel_rec.name = 'Desert Oasis Hotel' THEN
                image_urls := ARRAY[
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
                    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f',
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'
                ];
            ELSE
                image_urls := ARRAY[
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
                    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000'
                ];
        END CASE;
        
        -- Insert the images
        FOR i IN 1..array_length(image_urls, 1) LOOP
            INSERT INTO hotel_images (hotel_id, image_url, is_main)
            VALUES (hotel_rec.id, image_urls[i], i = 1);
        END LOOP;
        
        -- Insert availability packages (2 per hotel)
        INSERT INTO availability_packages (hotel_id, start_date, end_date, duration_days, total_rooms, available_rooms)
        VALUES 
            (hotel_rec.id, '2024-03-01'::date, '2024-03-08'::date, 8, 15, 4),
            (hotel_rec.id, '2024-04-15'::date, '2024-04-29'::date, 15, 18, 3);
            
    END LOOP;
END $$;
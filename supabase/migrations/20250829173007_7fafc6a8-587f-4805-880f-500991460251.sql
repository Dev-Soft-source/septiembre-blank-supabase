-- Step 4a: Add test images to allow hotel approval
INSERT INTO hotel_images (hotel_id, image_url, is_main)
SELECT h.id, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3', true
FROM hotels h WHERE h.name = 'Prioridad 1';
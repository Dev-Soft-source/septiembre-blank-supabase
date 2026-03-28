-- Step 6: Add test hotel images for approval
INSERT INTO hotel_images (hotel_id, image_url, is_main)
VALUES 
  ('f3f4bc58-dade-476a-9a0a-5d31e34b5f10', 'https://example.com/prioridad1-lobby.jpg', true),
  ('f3f4bc58-dade-476a-9a0a-5d31e34b5f10', 'https://example.com/prioridad1-room.jpg', false),
  ('f3f4bc58-dade-476a-9a0a-5d31e34b5f10', 'https://example.com/prioridad1-restaurant.jpg', false)
RETURNING hotel_id, image_url, is_main;
-- Fix Desert Springs Hotel black image issue
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE name = 'Desert Springs Hotel' AND city = 'Tucson';
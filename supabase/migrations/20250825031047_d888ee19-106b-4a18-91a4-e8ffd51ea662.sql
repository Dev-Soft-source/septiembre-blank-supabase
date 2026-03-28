-- Replace duplicate hotel images with unique ones

-- Pine Forest Retreat (Augusta, USA) - Forest retreat with modern amenities
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '6c9bd85a-1508-4c51-8962-0951ee8bc4a2';

-- South Austin Lodge (Austin, United States) - Modern Austin lodge
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '984d2175-8f38-439f-af06-052ef8d3f24a';

-- Riverside Inn Boise (Boise, USA) - Riverside hotel with mountain views
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = 'a760588e-7165-4eff-aeb8-615714bf7abe';

-- The Pearl District Inn (Portland, United States) - Urban Portland boutique hotel
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '8ed05a9c-873c-4a7b-9770-dc82095cb134';

-- Wasatch Mountain View Hotel (Salt Lake City, United States) - Mountain resort hotel
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = 'd4404dc8-4c2a-4162-9e44-f7d862905795';

-- Gulf Coast Heritage Inn (Mobile, United States) - Historic Southern inn
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '5996b848-134a-452b-ae43-4de1cb08e2bd';

-- Hampton Inn Anchorage (Anchorage, United States) - Alaska wilderness lodge
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1531894848132-6c5f5a6fabe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '6d0e0269-07ed-4599-9c47-ca7496338890';
-- Replace Desert Springs Hotel and Casino District Hotel with proper building/interior images

-- Desert Springs Hotel (Tucson, USA) - Desert resort hotel building
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = 'ac98f132-251f-4165-b69f-78f493d740b6';

-- Casino District Hotel (Atlantic City, USA) - Upscale casino hotel interior/lobby
UPDATE hotels 
SET main_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '2f863d47-3480-483f-b39d-e4ecaa629f7a';
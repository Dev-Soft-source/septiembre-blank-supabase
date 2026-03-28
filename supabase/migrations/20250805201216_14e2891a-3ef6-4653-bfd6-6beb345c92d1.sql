-- Fix hotel images with working Unsplash URLs from placeholder images

-- Adobe Hills Inn (Santa Fe) - mountain landscape
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e' 
WHERE name = 'Adobe Hills Inn';

-- Gulf Coast Heritage Inn (Mobile) - ocean/coastal
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21' 
WHERE name = 'Gulf Coast Heritage Inn';

-- Big Sky Urban Lodge (Billings) - urban building
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e' 
WHERE name = 'Big Sky Urban Lodge';

-- Green Mountain Inn (Burlington) - nature/mountain
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1501854140801-50d01698950b' 
WHERE name = 'Green Mountain Inn';

-- Historic District Lodge (Savannah) - historic building
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1527576539890-dfa815648363' 
WHERE name = 'Historic District Lodge';

-- Blue Ridge Mountain Lodge (Asheville) - mountain lodge
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e' 
WHERE name = 'Blue Ridge Mountain Lodge';
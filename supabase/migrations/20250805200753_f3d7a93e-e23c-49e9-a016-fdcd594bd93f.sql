-- Update hotel images with better, more specific photos that should load properly

-- Adobe Hills Inn (Santa Fe) - Southwest desert hotel
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' 
WHERE name = 'Adobe Hills Inn';

-- Gulf Coast Heritage Inn (Mobile) - Historic coastal hotel
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1520637736862-4d197d17c35a?w=800' 
WHERE name = 'Gulf Coast Heritage Inn';

-- Big Sky Urban Lodge (Billings) - Urban lodge
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' 
WHERE name = 'Big Sky Urban Lodge';

-- Green Mountain Inn (Burlington) - Lake/mountain inn
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800' 
WHERE name = 'Green Mountain Inn';

-- Historic District Lodge (Savannah) - Historic building
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800' 
WHERE name = 'Historic District Lodge';

-- Blue Ridge Mountain Lodge (Asheville) - Mountain lodge with pool
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800' 
WHERE name = 'Blue Ridge Mountain Lodge';
-- Update missing hotel images with appropriate photos

UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=800' 
WHERE name = 'Adobe Hills Inn';

UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1520637736862-4d197d17c35a?w=800' 
WHERE name = 'Gulf Coast Heritage Inn';

UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800' 
WHERE name = 'Blue Ridge Mountain Lodge';

UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800' 
WHERE name = 'Historic District Lodge';

UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800' 
WHERE name = 'Big Sky Urban Lodge';

UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800' 
WHERE name = 'Green Mountain Inn';
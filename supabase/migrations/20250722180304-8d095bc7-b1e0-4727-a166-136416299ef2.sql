
-- Delete corrupted test hotel records created before July 22, 2025
DELETE FROM public.hotels 
WHERE created_at < '2025-07-22'::date 
AND (
  -- Test entries with specific names
  LOWER(name) IN ('julio', 'julio 22', 'a ver', '', 'test', 'hotel test', 'prueba') 
  OR 
  -- Hotels with null owner_id and empty/placeholder names
  (owner_id IS NULL AND (name IS NULL OR TRIM(name) = '' OR LENGTH(name) < 3))
  OR
  -- Additional safety check for obvious test patterns
  (name ~* '^(test|prueba|ejemplo|sample|demo|xxx|yyy|zzz|aaa|bbb)' OR name ~* '(test|prueba)$')
);

-- Also clean up any orphaned hotel_images for deleted hotels
DELETE FROM public.hotel_images 
WHERE hotel_id NOT IN (SELECT id FROM public.hotels);

-- Clean up any orphaned hotel_themes for deleted hotels  
DELETE FROM public.hotel_themes 
WHERE hotel_id NOT IN (SELECT id FROM public.hotels);

-- Clean up any orphaned hotel_activities for deleted hotels
DELETE FROM public.hotel_activities 
WHERE hotel_id NOT IN (SELECT id FROM public.hotels);

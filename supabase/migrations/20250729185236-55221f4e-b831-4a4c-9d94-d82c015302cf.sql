-- Fix storage policies for Hotel Images bucket
CREATE POLICY "Hotel owners can upload images to their hotels"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'Hotel Images' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE id::text = (string_to_array(name, '/'))[1] 
    AND owner_id = auth.uid()
  )
);

CREATE POLICY "Hotel owners can view images from their hotels"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'Hotel Images'
  AND (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.hotels 
      WHERE id::text = (string_to_array(name, '/'))[1] 
      AND owner_id = auth.uid()
    )
    OR bucket_id = 'Hotel Images' -- Allow public read for Hotel Images
  )
);

CREATE POLICY "Hotel owners can update images from their hotels"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'Hotel Images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE id::text = (string_to_array(name, '/'))[1] 
    AND owner_id = auth.uid()
  )
);

CREATE POLICY "Hotel owners can delete images from their hotels"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'Hotel Images'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE id::text = (string_to_array(name, '/'))[1] 
    AND owner_id = auth.uid()
  )
);

CREATE POLICY "Public can view Hotel Images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'Hotel Images');

-- Ensure hotel_themes policies are working correctly
DROP POLICY IF EXISTS "Hotel owners can manage their hotel themes" ON public.hotel_themes;

CREATE POLICY "Hotel owners can insert their hotel themes"
ON public.hotel_themes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = hotel_themes.hotel_id 
    AND hotels.owner_id = auth.uid()
  )
);

CREATE POLICY "Hotel owners can update their hotel themes"
ON public.hotel_themes
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = hotel_themes.hotel_id 
    AND hotels.owner_id = auth.uid()
  )
);

CREATE POLICY "Hotel owners can delete their hotel themes"
ON public.hotel_themes
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = hotel_themes.hotel_id 
    AND hotels.owner_id = auth.uid()
  )
);

CREATE POLICY "Public can view approved hotel themes"
ON public.hotel_themes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = hotel_themes.hotel_id 
    AND hotels.status = 'approved'
  )
);

CREATE POLICY "Hotel owners can view their hotel themes"
ON public.hotel_themes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = hotel_themes.hotel_id 
    AND (hotels.owner_id = auth.uid() OR hotels.status = 'approved')
  )
);
-- Fix RLS policies for hotel_themes to allow hotel owners to insert themes
DROP POLICY IF EXISTS "Hotel owners can manage their hotel themes" ON public.hotel_themes;
DROP POLICY IF EXISTS "Admin users can manage hotel themes" ON public.hotel_themes;

-- Create simplified policies that don't check user_roles table
CREATE POLICY "Hotel owners can manage their hotel themes" 
ON public.hotel_themes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = hotel_themes.hotel_id 
    AND hotels.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = hotel_themes.hotel_id 
    AND hotels.owner_id = auth.uid()
  )
);

-- Fix storage policies for Hotel Images bucket
-- Allow authenticated users to upload images to their hotel folders
CREATE POLICY "Hotel owners can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'Hotel Images' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] IN (
    SELECT hotels.id::text 
    FROM public.hotels 
    WHERE hotels.owner_id = auth.uid()
  )
);

CREATE POLICY "Hotel owners can view their images" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'Hotel Images' 
  AND (
    auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] IN (
      SELECT hotels.id::text 
      FROM public.hotels 
      WHERE hotels.owner_id = auth.uid()
    )
  )
);

CREATE POLICY "Public can view hotel images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'Hotel Images');

CREATE POLICY "Hotel owners can update their images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'Hotel Images' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] IN (
    SELECT hotels.id::text 
    FROM public.hotels 
    WHERE hotels.owner_id = auth.uid()
  )
);

CREATE POLICY "Hotel owners can delete their images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'Hotel Images' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] IN (
    SELECT hotels.id::text 
    FROM public.hotels 
    WHERE hotels.owner_id = auth.uid()
  )
);
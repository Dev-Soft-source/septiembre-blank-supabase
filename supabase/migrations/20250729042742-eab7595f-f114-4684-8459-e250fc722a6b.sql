-- Drop existing storage policies for Hotel Images bucket
DROP POLICY IF EXISTS "Public can view hotel images" ON storage.objects;
DROP POLICY IF EXISTS "Hotel owners can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Hotel owners can view their images" ON storage.objects;
DROP POLICY IF EXISTS "Hotel owners can update their images" ON storage.objects;
DROP POLICY IF EXISTS "Hotel owners can delete their images" ON storage.objects;

-- Create new storage policies for Hotel Images bucket
CREATE POLICY "Public can view hotel images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'Hotel Images');

CREATE POLICY "Hotel owners can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'Hotel Images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Hotel owners can view their images" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'Hotel Images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Hotel owners can update their images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'Hotel Images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Hotel owners can delete their images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'Hotel Images' 
  AND auth.uid() IS NOT NULL
);
-- Make the PRESS KIT bucket public for download access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'PRESS KIT';

-- Create RLS policies for public access to press kit files
CREATE POLICY "Allow public downloads from press kit bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'PRESS KIT');
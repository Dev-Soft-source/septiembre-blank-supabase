-- Create exports storage bucket for CSV files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('exports', 'exports', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Public can view exports" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload exports" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update exports" ON storage.objects;

-- Create policy to allow public read access to exports bucket
CREATE POLICY "Public can view exports" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'exports');

-- Create policy to allow service role to upload to exports bucket  
CREATE POLICY "Service role can upload exports"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'exports' AND auth.role() = 'service_role');

-- Create policy to allow service role to update exports bucket
CREATE POLICY "Service role can update exports"
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'exports' AND auth.role() = 'service_role');
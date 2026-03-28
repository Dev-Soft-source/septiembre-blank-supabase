
-- Create storage bucket for join us file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('join-us-uploads', 'join-us-uploads', true);

-- Create storage policies for the bucket
CREATE POLICY "Anyone can view join us uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'join-us-uploads');

CREATE POLICY "Anyone can upload join us files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'join-us-uploads');

CREATE POLICY "Anyone can update join us files" ON storage.objects
FOR UPDATE USING (bucket_id = 'join-us-uploads');

CREATE POLICY "Anyone can delete join us files" ON storage.objects
FOR DELETE USING (bucket_id = 'join-us-uploads');

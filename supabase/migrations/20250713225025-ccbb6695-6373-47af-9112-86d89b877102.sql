-- Create a storage bucket for Excel calculators
INSERT INTO storage.buckets (id, name, public) 
VALUES ('excel-calculators', 'excel-calculators', true);

-- Create policies for public access to the Excel files
CREATE POLICY "Public read access for Excel calculators" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'excel-calculators');

CREATE POLICY "Public insert access for Excel calculators" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'excel-calculators');
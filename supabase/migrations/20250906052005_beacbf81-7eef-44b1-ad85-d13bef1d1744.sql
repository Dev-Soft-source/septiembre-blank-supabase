-- Enable RLS and create policies for new tables
ALTER TABLE public.hotel_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hotel_themes
CREATE POLICY "Hotel themes are publicly viewable" 
ON public.hotel_themes 
FOR SELECT 
USING (true);

CREATE POLICY "Hotel owners can manage themes" 
ON public.hotel_themes 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM hotels h 
  JOIN profiles p ON p.id = h.profile_id 
  WHERE h.id = hotel_themes.hotel_id AND p.user_id = auth.uid()
));

-- Create RLS policies for hotel_translations
CREATE POLICY "Hotel translations are publicly viewable" 
ON public.hotel_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Hotel owners can manage translations" 
ON public.hotel_translations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM hotels h 
  JOIN profiles p ON p.id = h.profile_id 
  WHERE h.id = hotel_translations.hotel_id AND p.user_id = auth.uid()
));

-- Now execute the SQL files again with fixed schema
SELECT extensions.http_post(
  'https://zlzsnpkddpshdyjlwxzv.supabase.co/functions/v1/execute-sql-from-storage',
  '{}',
  'application/json'
) as hotel_data_import_with_fixed_schema;
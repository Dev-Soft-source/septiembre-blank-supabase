-- Create themes table with data
CREATE TABLE public.themes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  level integer DEFAULT 1,
  parent_id uuid,
  category text,
  sort_order integer,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for themes
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for themes
CREATE POLICY "Themes are publicly viewable" ON public.themes FOR SELECT USING (true);

-- Insert sample themes data
INSERT INTO public.themes (name, category, sort_order) VALUES
('ART', 'ART', 1),
('CULTURE', 'CULTURE', 2),
('DANCE', 'DANCE', 3),
('FOODS & DRINKS', 'FOODS & DRINKS', 4),
('GAMES', 'GAMES', 5),
('HEALTH AND WELLNESS', 'HEALTH AND WELLNESS', 6),
('HOBBIES', 'HOBBIES', 7),
('LANGUAGES', 'LANGUAGES', 8),
('LITERATURE', 'LITERATURE', 9),
('MUSIC', 'MUSIC', 10),
('SCIENCES', 'SCIENCES', 11),
('SPORTS', 'SPORTS', 12),
('TECHNOLOGY', 'TECHNOLOGY', 13);

-- Add foreign key constraint to hotel_themes
ALTER TABLE public.hotel_themes 
ADD CONSTRAINT hotel_themes_theme_id_fkey 
FOREIGN KEY (theme_id) REFERENCES public.themes(id) ON DELETE CASCADE;
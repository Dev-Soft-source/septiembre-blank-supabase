
-- Create theme_translations table for multilingual support
CREATE TABLE theme_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL, -- 'en', 'es', 'fr', etc.
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(theme_id, locale)
);

-- Add index for better query performance
CREATE INDEX idx_theme_translations_theme_locale ON theme_translations(theme_id, locale);
CREATE INDEX idx_theme_translations_locale ON theme_translations(locale);

-- Enable Row Level Security (consistent with other tables)
ALTER TABLE theme_translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to translations (since themes are public data)
CREATE POLICY "Public read access to theme translations" 
  ON theme_translations 
  FOR SELECT 
  TO public 
  USING (true);


-- Create hotel_translations table for storing translated hotel content
CREATE TABLE public.hotel_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL CHECK (language_code IN ('es', 'pt', 'ro')),
  translated_name TEXT,
  translated_description TEXT,
  translated_ideal_guests TEXT,
  translated_atmosphere TEXT,
  translated_perfect_location TEXT,
  translation_status TEXT NOT NULL DEFAULT 'pending' CHECK (translation_status IN ('pending', 'completed', 'failed', 'manual_edit')),
  auto_generated BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hotel_id, language_code)
);

-- Create indexes for better query performance
CREATE INDEX idx_hotel_translations_hotel_id ON public.hotel_translations(hotel_id);
CREATE INDEX idx_hotel_translations_language_code ON public.hotel_translations(language_code);
CREATE INDEX idx_hotel_translations_status ON public.hotel_translations(translation_status);
CREATE INDEX idx_hotel_translations_updated_at ON public.hotel_translations(updated_at);

-- Enable Row Level Security
ALTER TABLE public.hotel_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hotel translations
CREATE POLICY "Allow public read access to completed translations" 
  ON public.hotel_translations 
  FOR SELECT 
  USING (translation_status = 'completed');

CREATE POLICY "Allow hotel owners to view their hotel translations" 
  ON public.hotel_translations 
  FOR SELECT 
  USING (
    hotel_id IN (
      SELECT id FROM public.hotels WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Allow hotel owners to update their hotel translations" 
  ON public.hotel_translations 
  FOR UPDATE 
  USING (
    hotel_id IN (
      SELECT id FROM public.hotels WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Allow system to insert translations" 
  ON public.hotel_translations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow system to update translation status" 
  ON public.hotel_translations 
  FOR UPDATE 
  USING (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_hotel_translations_updated_at
  BEFORE UPDATE ON public.hotel_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE public.hotel_translations IS 'Stores translated content for hotels in different languages';
COMMENT ON COLUMN public.hotel_translations.language_code IS 'ISO language code: es (Spanish), pt (Portuguese), ro (Romanian)';
COMMENT ON COLUMN public.hotel_translations.translation_status IS 'Status of translation: pending, completed, failed, manual_edit';
COMMENT ON COLUMN public.hotel_translations.auto_generated IS 'Whether translation was auto-generated or manually created';

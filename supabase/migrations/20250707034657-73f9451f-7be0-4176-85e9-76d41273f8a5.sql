-- Phase 1: Create filter_value_mappings table for Spanish ↔ English synchronization
CREATE TABLE public.filter_value_mappings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  spanish_value text NOT NULL,
  english_value text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Ensure unique mappings per category
  UNIQUE(category, spanish_value),
  UNIQUE(category, english_value)
);

-- Enable RLS
ALTER TABLE public.filter_value_mappings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view filter mappings" 
ON public.filter_value_mappings 
FOR SELECT 
USING (true);

-- Admin users can manage mappings
CREATE POLICY "Admin users can manage filter mappings" 
ON public.filter_value_mappings 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Populate meal plan mappings
INSERT INTO public.filter_value_mappings (category, spanish_value, english_value) VALUES
('meal_plans', 'Solo alojamiento', 'Room Only'),
('meal_plans', 'Desayuno incluido', 'Breakfast Included'),
('meal_plans', 'Media pensión', 'Half Board'),
('meal_plans', 'Pensión completa', 'Full Board'),
('meal_plans', 'Todo incluido', 'All Inclusive');

-- Populate room types mappings
INSERT INTO public.filter_value_mappings (category, spanish_value, english_value) VALUES
('room_types', 'Habitación individual', 'Single Room'),
('room_types', 'Habitación doble', 'Double Room'),
('room_types', 'Apartamento', 'Apartment'),
('room_types', 'Suite', 'Suite'),
('room_types', 'Estudio', 'Studio');

-- Populate property style mappings
INSERT INTO public.filter_value_mappings (category, spanish_value, english_value) VALUES
('property_styles', 'Fusión', 'Fusion'),
('property_styles', 'Clásico', 'Classic'),
('property_styles', 'Minimalista', 'Minimalist'),
('property_styles', 'Moderno', 'Modern'),
('property_styles', 'Rústico', 'Rustic'),
('property_styles', 'Tradicional', 'Traditional');

-- Create index for performance
CREATE INDEX idx_filter_mappings_category ON public.filter_value_mappings(category);
CREATE INDEX idx_filter_mappings_active ON public.filter_value_mappings(is_active);

-- Create trigger for updated_at
CREATE TRIGGER update_filter_mappings_updated_at
BEFORE UPDATE ON public.filter_value_mappings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
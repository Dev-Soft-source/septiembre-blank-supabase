
-- Create hotel associations table
CREATE TABLE public.hotel_associations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  association_name TEXT NOT NULL,
  association_code TEXT NOT NULL UNIQUE,
  responsible_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bank_account TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for uploaded hotel lists by associations
CREATE TABLE public.association_hotels_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  association_id UUID NOT NULL REFERENCES public.hotel_associations(id) ON DELETE CASCADE,
  hotel_name TEXT NOT NULL,
  city TEXT,
  contact_email TEXT,
  is_registered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for association commissions
CREATE TABLE public.association_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  association_id UUID NOT NULL REFERENCES public.hotel_associations(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  commission_amount NUMERIC NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 0.04,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add association_id column to hotels table
ALTER TABLE public.hotels 
ADD COLUMN association_id UUID REFERENCES public.hotel_associations(id) ON DELETE SET NULL;

-- Enable RLS on all association tables
ALTER TABLE public.hotel_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_hotels_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_commissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for hotel_associations
CREATE POLICY "Associations can view their own data" 
  ON public.hotel_associations 
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT p.id FROM public.profiles p WHERE p.email = hotel_associations.email
  ));

CREATE POLICY "Associations can update their own data" 
  ON public.hotel_associations 
  FOR UPDATE 
  USING (auth.uid() IN (
    SELECT p.id FROM public.profiles p WHERE p.email = hotel_associations.email
  ));

CREATE POLICY "Anyone can insert association data" 
  ON public.hotel_associations 
  FOR INSERT 
  WITH CHECK (true);

-- RLS policies for association_hotels_uploads
CREATE POLICY "Associations can manage their uploaded hotels" 
  ON public.association_hotels_uploads 
  FOR ALL 
  USING (association_id IN (
    SELECT ha.id FROM public.hotel_associations ha 
    JOIN public.profiles p ON p.email = ha.email 
    WHERE p.id = auth.uid()
  ));

-- RLS policies for association_commissions
CREATE POLICY "Associations can view their commissions" 
  ON public.association_commissions 
  FOR SELECT 
  USING (association_id IN (
    SELECT ha.id FROM public.hotel_associations ha 
    JOIN public.profiles p ON p.email = ha.email 
    WHERE p.id = auth.uid()
  ));

CREATE POLICY "Admins can manage all commissions" 
  ON public.association_commissions 
  FOR ALL 
  USING (has_role('admin'));

-- Function to generate association code
CREATE OR REPLACE FUNCTION public.generate_association_code(association_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  words text[];
  first_word text;
  second_word text;
  code text;
  counter integer := 1;
  final_code text;
BEGIN
  -- Split association name into words
  words := string_to_array(upper(association_name), ' ');
  
  -- Get first word (first 5 letters)
  first_word := left(words[1], 5);
  
  -- Get second word if exists (first 5 letters)
  IF array_length(words, 1) > 1 THEN
    second_word := left(words[2], 5);
    code := first_word || second_word;
  ELSE
    code := left(first_word || first_word, 10);
  END IF;
  
  -- Ensure code is exactly 10 characters by padding if needed
  code := rpad(code, 10, 'X');
  final_code := code;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.hotel_associations WHERE association_code = final_code) LOOP
    counter := counter + 1;
    final_code := left(code, 8) || lpad(counter::text, 2, '0');
  END LOOP;
  
  RETURN final_code;
END;
$$;

-- Trigger to automatically generate association code
CREATE OR REPLACE FUNCTION public.set_association_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.association_code IS NULL OR NEW.association_code = '' THEN
    NEW.association_code := public.generate_association_code(NEW.association_name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_association_code
  BEFORE INSERT ON public.hotel_associations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_association_code();

-- Function to calculate and insert commission when booking is created
CREATE OR REPLACE FUNCTION public.calculate_association_commission()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the hotel belongs to an association
  IF NEW.hotel_id IN (SELECT id FROM public.hotels WHERE association_id IS NOT NULL) THEN
    INSERT INTO public.association_commissions (
      association_id,
      hotel_id,
      booking_id,
      commission_amount,
      commission_rate
    )
    SELECT 
      h.association_id,
      NEW.hotel_id,
      NEW.id,
      NEW.total_price * 0.04,
      0.04
    FROM public.hotels h
    WHERE h.id = NEW.hotel_id AND h.association_id IS NOT NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_calculate_association_commission
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_association_commission();

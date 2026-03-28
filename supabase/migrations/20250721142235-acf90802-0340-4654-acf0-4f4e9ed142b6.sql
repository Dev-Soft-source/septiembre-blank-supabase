
-- Create hotel_associations table with proper structure
CREATE TABLE public.hotel_associations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  association_name text NOT NULL,
  email text NOT NULL UNIQUE,
  country text NOT NULL,
  responsible_person text NOT NULL,
  association_code text UNIQUE,
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hotel_associations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hotel associations
CREATE POLICY "Users can view their own association data" 
ON public.hotel_associations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own association data" 
ON public.hotel_associations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own association data" 
ON public.hotel_associations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all associations" 
ON public.hotel_associations 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create function to generate association codes
CREATE OR REPLACE FUNCTION public.generate_association_code(association_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 1;
BEGIN
  -- Extract first 3 letters from association name and add 3 random digits
  base_code := UPPER(LEFT(regexp_replace(association_name, '[^a-zA-Z]', '', 'g'), 3)) || 
               LPAD(floor(random() * 1000)::text, 3, '0');
  final_code := base_code;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.hotel_associations WHERE association_code = final_code) LOOP
    counter := counter + 1;
    final_code := base_code || counter::TEXT;
  END LOOP;
  
  RETURN final_code;
END;
$$;

-- Create trigger to auto-generate association codes
CREATE OR REPLACE FUNCTION public.set_association_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.association_code IS NULL THEN
    NEW.association_code := public.generate_association_code(NEW.association_name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_association_code
  BEFORE INSERT ON public.hotel_associations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_association_code();

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_hotel_associations_updated_at
BEFORE UPDATE ON public.hotel_associations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.can_access_sensitive_hotel_data(hotel_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    -- Admin users can access all data
    is_admin(auth.uid()) OR 
    -- Hotel owners can access their own hotel's data
    EXISTS (
      SELECT 1 FROM public.hotels 
      WHERE id = hotel_id_param AND owner_id = auth.uid()
    ) OR
    -- Users with confirmed bookings can access limited contact data
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE hotel_id = hotel_id_param 
      AND user_id = auth.uid() 
      AND status = 'confirmed'
    );
$$;

-- Fix audit function search path
CREATE OR REPLACE FUNCTION public.audit_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log access to sensitive hotel data
  INSERT INTO public.admin_logs (admin_id, action, details)
  VALUES (
    COALESCE(auth.uid()::text, 'anonymous'),
    'sensitive_data_access',
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'record_id', NEW.id,
      'timestamp', now(),
      'user_id', auth.uid()
    )
  );
  RETURN NEW;
END;
$$;

-- Add missing RLS policies for tables that have RLS enabled but no policies

-- Check if commission_audit already has RLS policies, if not add them
CREATE POLICY "System can insert commission audit records" ON public.commission_audit
FOR INSERT WITH CHECK (true);

-- Add RLS policies for hotel_commission_link (already enabled RLS)
CREATE POLICY "Admins can manage hotel commission links" ON public.hotel_commission_link
FOR ALL USING (is_admin(auth.uid()));

-- Ensure all sensitive functions have proper search paths
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_simple()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  );
$$;

-- Update other security-related functions to have proper search paths
CREATE OR REPLACE FUNCTION public.generate_agent_code(first_name text, last_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 1;
BEGIN
  base_code := UPPER(LEFT(first_name, 3)) || UPPER(LEFT(last_name, 3));
  final_code := base_code;
  
  WHILE EXISTS (SELECT 1 FROM public.agents WHERE agent_code = final_code) LOOP
    counter := counter + 1;
    final_code := base_code || counter::TEXT;
  END LOOP;
  
  RETURN final_code;
END;
$$;

-- Create a view for public hotel data that excludes sensitive fields
CREATE OR REPLACE VIEW public.hotels_public AS
SELECT 
  id,
  name,
  description,
  country,
  city,
  address,
  latitude,
  longitude,
  price_per_month,
  main_image_url,
  category,
  property_type,
  style,
  ideal_guests,
  atmosphere,
  perfect_location,
  is_featured,
  created_at,
  updated_at,
  status,
  available_months,
  features_hotel,
  features_room,
  meal_plans,
  room_types,
  stay_lengths,
  terms,
  enable_price_increase,
  price_increase_cap
FROM public.hotels
WHERE status = 'approved';

-- Grant public access to the view
GRANT SELECT ON public.hotels_public TO anon, authenticated;

-- Create secure function for getting hotel contact info (only for confirmed bookings)
CREATE OR REPLACE FUNCTION public.get_hotel_contact_for_guest(hotel_id_param uuid)
RETURNS TABLE(contact_name text, contact_email text, contact_phone text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    h.contact_name,
    h.contact_email,
    h.contact_phone
  FROM public.hotels h
  WHERE h.id = hotel_id_param
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.hotel_id = hotel_id_param
    AND b.user_id = auth.uid()
    AND b.status = 'confirmed'
  );
$$;
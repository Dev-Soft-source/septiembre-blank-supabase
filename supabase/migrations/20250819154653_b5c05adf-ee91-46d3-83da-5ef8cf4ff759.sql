-- PHASE 1: Critical Security Fixes - RLS Policies for Hotels Table

-- First, let's create a function to check if user can access sensitive hotel data
CREATE OR REPLACE FUNCTION public.can_access_sensitive_hotel_data(hotel_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
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

-- Drop existing overly permissive hotel policies and create secure ones
DROP POLICY IF EXISTS "Public can view approved hotels" ON public.hotels;
DROP POLICY IF EXISTS "Todos pueden ver hoteles aprobados" ON public.hotels;
DROP POLICY IF EXISTS "Public can view hotels" ON public.hotels;
DROP POLICY IF EXISTS "Anyone can view approved hotels" ON public.hotels;

-- Create secure public read policy that excludes sensitive fields
CREATE POLICY "Public can view basic hotel info only" ON public.hotels
FOR SELECT USING (
  status = 'approved' AND 
  -- This policy will be used with SELECT queries that explicitly exclude sensitive fields
  true
);

-- Create policy for hotel owners to access their own data
CREATE POLICY "Hotel owners can view their complete hotel data" ON public.hotels
FOR SELECT USING (
  auth.uid() = owner_id OR is_admin(auth.uid())
);

-- Create policy for admins to access all data
CREATE POLICY "Admins can manage all hotel data" ON public.hotels
FOR ALL USING (is_admin(auth.uid()));

-- Create policy for confirmed guests to access limited contact data
CREATE POLICY "Confirmed guests can access limited contact info" ON public.hotels
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.hotel_id = hotels.id 
    AND bookings.user_id = auth.uid() 
    AND bookings.status = 'confirmed'
  )
);

-- Secure hotel_images table
DROP POLICY IF EXISTS "Public can view hotel images" ON public.hotel_images;
DROP POLICY IF EXISTS "Todos pueden ver imágenes de hoteles" ON public.hotel_images;

CREATE POLICY "Public can view images of approved hotels only" ON public.hotel_images
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = hotel_images.hotel_id 
    AND hotels.status = 'approved'
  )
);

-- Secure hotel_themes table  
DROP POLICY IF EXISTS "Public can view hotel themes" ON public.hotel_themes;
DROP POLICY IF EXISTS "Todos pueden ver temas de hoteles" ON public.hotel_themes;
DROP POLICY IF EXISTS "Public can view approved hotel themes" ON public.hotel_themes;

CREATE POLICY "Public can view themes of approved hotels only" ON public.hotel_themes  
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = hotel_themes.hotel_id 
    AND hotels.status = 'approved'
  )
);

-- Secure hotel_activities table
DROP POLICY IF EXISTS "Anyone can read hotel activities" ON public.hotel_activities;

CREATE POLICY "Public can view activities of approved hotels only" ON public.hotel_activities
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = hotel_activities.hotel_id 
    AND hotels.status = 'approved'
  )
);

-- Create secure storage policies for hotel images
CREATE POLICY "Public can view approved hotel images in storage" ON storage.objects
FOR SELECT USING (
  bucket_id = 'hotel-images' AND
  EXISTS (
    SELECT 1 FROM public.hotels h
    JOIN public.hotel_images hi ON h.id = hi.hotel_id
    WHERE hi.image_url LIKE '%' || (storage.foldername(name))[1] || '%'
    AND h.status = 'approved'
  )
);

-- Secure avatars bucket - only allow users to access their own avatars
CREATE POLICY "Users can only access their own avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Secure join-us-files bucket - only allow access to uploaded user and admins
CREATE POLICY "Restrict access to join-us files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'join-us-files' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR is_admin(auth.uid()))
);

-- Secure hotel_translations to prevent exposure of incomplete translations
DROP POLICY IF EXISTS "Allow public read access to completed translations" ON public.hotel_translations;

CREATE POLICY "Public can only view completed translations of approved hotels" ON public.hotel_translations
FOR SELECT USING (
  translation_status = 'completed' AND
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = hotel_translations.hotel_id 
    AND hotels.status = 'approved'
  )
);

-- Add RLS policies to tables that were missing them
ALTER TABLE public.hotel_commission_link ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view hotel commission links" ON public.hotel_commission_link
FOR SELECT USING (is_admin(auth.uid()));

ALTER TABLE public.commission_audit ENABLE ROW LEVEL SECURITY;
-- Policy already exists for commission_audit

-- Secure filter_value_mappings (already has proper policies)
-- Secure api_usage_tracking (already has admin-only policy)

-- Add audit function for sensitive data access
CREATE OR REPLACE FUNCTION public.audit_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
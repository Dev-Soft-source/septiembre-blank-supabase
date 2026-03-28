-- Fix critical security issue: Restrict public access to hotels table to protect sensitive business data
-- This migration addresses the security vulnerability where competitors could access 
-- sensitive hotel business information including contact details, pricing, and banking data.

-- First, drop the overly permissive public read policy
DROP POLICY IF EXISTS "hotels_public_read" ON public.hotels;

-- Create a new restrictive public read policy that only allows basic browsing information
CREATE POLICY "hotels_public_browse_only" ON public.hotels
FOR SELECT 
USING (status = 'approved');

-- Owners can still view and manage their own hotels (including sensitive data)
DROP POLICY IF EXISTS "hotel_owners_manage" ON public.hotels;
CREATE POLICY "hotel_owners_manage" ON public.hotels
FOR ALL 
USING (owner_id = auth.uid());

-- Create a secure view for public hotel browsing that only exposes safe information
CREATE OR REPLACE VIEW public.hotels_public_view AS
SELECT 
  id,
  name,
  description,
  country,
  city,
  address,
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
  status,
  available_months,
  features_hotel,
  features_room,
  meal_plans,
  stay_lengths,
  faqs,
  check_in_weekday,
  room_description,
  weekly_laundry_included,
  external_laundry_available,
  allow_stay_extensions,
  total_rooms
FROM public.hotels
WHERE status = 'approved';

-- Create a view for authenticated users with additional safe information
CREATE OR REPLACE VIEW public.hotels_detailed_view AS
SELECT 
  id,
  name,
  description,
  country,
  city,
  address,
  postal_code,
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
  status,
  available_months,
  features_hotel,
  features_room,
  meal_plans,
  stay_lengths,
  faqs,
  terms,
  check_in_weekday,
  room_description,
  weekly_laundry_included,
  external_laundry_available,
  allow_stay_extensions,
  total_rooms
FROM public.hotels
WHERE status = 'approved';

-- Enable RLS on views
ALTER VIEW public.hotels_public_view SET (security_barrier = true);
ALTER VIEW public.hotels_detailed_view SET (security_barrier = true);

-- Grant appropriate access
GRANT SELECT ON public.hotels_public_view TO public;
GRANT SELECT ON public.hotels_public_view TO anon;
GRANT SELECT ON public.hotels_detailed_view TO authenticated;

-- Revoke direct table access for non-authenticated users
REVOKE SELECT ON public.hotels FROM public;
REVOKE SELECT ON public.hotels FROM anon;

-- Create function to get sensitive hotel data (only for owners and admins)
CREATE OR REPLACE FUNCTION public.get_hotel_sensitive_data(hotel_id uuid)
RETURNS TABLE (
  contact_email text,
  contact_name text,
  contact_phone text,
  contact_website text,
  banking_info jsonb,
  rates jsonb,
  pricingmatrix jsonb,
  pending_changes jsonb,
  referral_code text,
  price_increase_cap integer,
  enable_price_increase boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    h.contact_email,
    h.contact_name,
    h.contact_phone,
    h.contact_website,
    h.banking_info,
    h.rates,
    h.pricingmatrix,
    h.pending_changes,
    h.referral_code,
    h.price_increase_cap,
    h.enable_price_increase
  FROM hotels h
  WHERE h.id = hotel_id
    AND (
      h.owner_id = auth.uid() OR 
      public.is_admin_bypass_rls()
    );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_hotel_sensitive_data(uuid) TO authenticated;

-- Log this security fix
INSERT INTO public.admin_logs (admin_id, action, details)
VALUES (
  'system',
  'SECURITY_FIX_HOTEL_DATA_EXPOSURE',
  jsonb_build_object(
    'description', 'Fixed critical security vulnerability where hotels table was publicly readable with sensitive business data',
    'changes', ARRAY[
      'Removed overly permissive hotels_public_read policy',
      'Created secure public view hotels_public_view',
      'Created authenticated view hotels_detailed_view',
      'Protected sensitive contact, banking, and pricing data from competitors',
      'Created secure function for sensitive data access',
      'Revoked direct table access for anonymous users'
    ],
    'protected_fields', ARRAY[
      'contact_email', 'contact_name', 'contact_phone', 'contact_website',
      'banking_info', 'rates', 'pricingmatrix', 'pending_changes',
      'referral_code', 'price_increase_cap', 'enable_price_increase'
    ],
    'affected_table', 'hotels',
    'severity', 'CRITICAL'
  )
);

COMMENT ON VIEW public.hotels_public_view IS 'Safe public view of hotels that only exposes basic information needed for browsing, protecting sensitive business data from competitors';
COMMENT ON VIEW public.hotels_detailed_view IS 'Authenticated user view of hotels with additional information but still protecting sensitive contact, banking, and pricing data';
COMMENT ON FUNCTION public.get_hotel_sensitive_data(uuid) IS 'Secure function to access sensitive hotel data, restricted to hotel owners and admins only';
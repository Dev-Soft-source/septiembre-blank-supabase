-- Fix hotel data access: Make prices public while keeping sensitive business data protected
-- This addresses the requirement that hotel prices must be public for browsing and booking

-- Update the public view to include full pricing and availability information
CREATE OR REPLACE VIEW public.hotels_public_view AS
SELECT 
  id,
  name,
  description,
  country,
  city,
  address,
  price_per_month, -- PRICES MUST BE PUBLIC
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
  stay_lengths,
  faqs,
  check_in_weekday,
  room_description,
  weekly_laundry_included,
  external_laundry_available,
  allow_stay_extensions,
  total_rooms,
  postal_code, -- Address info can be public
  terms, -- Public terms for guests
  -- PRICING INFORMATION MUST BE PUBLIC FOR BUSINESS MODEL
  enable_price_increase, -- Public pricing policy
  price_increase_cap,    -- Public pricing policy
  rates,                 -- Public rates for booking
  pricingmatrix         -- Public pricing for booking
FROM public.hotels
WHERE status = 'approved';

-- Update the detailed view for authenticated users (same as public now since prices are public)
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
  updated_at,
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
  total_rooms,
  -- PRICING INFORMATION IS PUBLIC
  enable_price_increase,
  price_increase_cap,
  rates,
  pricingmatrix
FROM public.hotels
WHERE status = 'approved';

-- Update the sensitive data function to only return truly sensitive business information
CREATE OR REPLACE FUNCTION public.get_hotel_sensitive_data(hotel_id uuid)
RETURNS TABLE (
  -- ONLY TRULY SENSITIVE BUSINESS DATA
  contact_email text,     -- Private business contact
  contact_name text,      -- Private business contact  
  contact_phone text,     -- Private business contact
  contact_website text,   -- Private business contact
  banking_info jsonb,     -- Financial/banking details
  referral_code text,     -- Commission/referral data
  pending_changes jsonb,  -- Internal management data
  owner_id uuid,          -- Internal ownership data
  rejection_reason text,  -- Internal admin data
  locked_by uuid,         -- Internal management data
  locked_at timestamp with time zone, -- Internal management data
  is_locked boolean,      -- Internal management data
  referred_by text        -- Internal referral tracking
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
    h.referral_code,
    h.pending_changes,
    h.owner_id,
    h.rejection_reason,
    h.locked_by,
    h.locked_at,
    h.is_locked,
    h.referred_by
  FROM hotels h
  WHERE h.id = hotel_id
    AND (
      h.owner_id = auth.uid() OR 
      EXISTS(SELECT 1 FROM admin_users WHERE id = auth.uid())
    );
$$;

-- Create a public view for availability packages (pricing must be public for booking)
CREATE OR REPLACE VIEW public.availability_packages_public_view AS
SELECT 
  id,
  hotel_id,
  start_date,
  end_date,
  duration_days,
  total_rooms,
  available_rooms,
  occupancy_mode,
  room_type,
  meal_plan,
  base_price_usd,     -- PRICES MUST BE PUBLIC
  current_price_usd,  -- PRICES MUST BE PUBLIC  
  created_at,
  updated_at
FROM public.availability_packages
WHERE hotel_id IN (
  SELECT id FROM public.hotels WHERE status = 'approved'
);

-- Grant public access to availability packages pricing
GRANT SELECT ON public.availability_packages_public_view TO public;
GRANT SELECT ON public.availability_packages_public_view TO anon;
GRANT SELECT ON public.availability_packages_public_view TO authenticated;

-- Enable security barrier for the new view
ALTER VIEW public.availability_packages_public_view SET (security_barrier = true);

-- Log the pricing visibility fix
INSERT INTO public.admin_logs (admin_id, action, details)
VALUES (
  'system',
  'SECURITY_FIX_PRICING_VISIBILITY',
  jsonb_build_object(
    'description', 'Fixed hotel data access to make prices public while protecting sensitive business data',
    'changes', ARRAY[
      'Made hotel prices public in hotels_public_view',
      'Made availability package pricing public',
      'Made pricing policies public (enable_price_increase, price_increase_cap)',
      'Made public rates and pricing matrices visible',
      'Restricted only truly sensitive data (contacts, banking, referrals)'
    ],
    'public_pricing_fields', ARRAY[
      'price_per_month', 'enable_price_increase', 'price_increase_cap', 
      'rates', 'pricingmatrix', 'base_price_usd', 'current_price_usd'
    ],
    'protected_fields', ARRAY[
      'contact_email', 'contact_name', 'contact_phone', 'contact_website',
      'banking_info', 'referral_code', 'pending_changes', 'owner_id'
    ],
    'business_requirement', 'Prices must be public for booking and business model',
    'severity', 'CRITICAL_FIX'
  )
);

COMMENT ON VIEW public.hotels_public_view IS 'Public view of hotels with full pricing information visible for browsing and booking, while protecting only truly sensitive business data';
COMMENT ON VIEW public.availability_packages_public_view IS 'Public view of availability packages with pricing information for booking functionality';
COMMENT ON FUNCTION public.get_hotel_sensitive_data(uuid) IS 'Access to truly sensitive business data (contacts, banking, referrals) - restricted to owners and admins only';
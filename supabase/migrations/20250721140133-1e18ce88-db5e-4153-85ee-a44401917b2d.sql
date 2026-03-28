
-- Fix search_path security issues for all affected functions
-- This prevents privilege escalation and search path injection attacks

-- Fix get_unique_countries function
CREATE OR REPLACE FUNCTION public.get_unique_countries()
 RETURNS TABLE(country_code text, country_name text, hotel_count bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    country,
    country,
    COUNT(*)::bigint
  FROM hotels 
  WHERE status = 'approved'
  GROUP BY country
  ORDER BY country;
$function$;

-- Fix get_cities_by_country function
CREATE OR REPLACE FUNCTION public.get_cities_by_country(country_filter text DEFAULT NULL::text)
 RETURNS TABLE(city_name text, country_code text, hotel_count bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    city,
    country,
    COUNT(*)::bigint
  FROM hotels 
  WHERE status = 'approved'
    AND (country_filter IS NULL OR country = country_filter)
  GROUP BY city, country
  ORDER BY city;
$function$;

-- Fix get_unique_property_types function
CREATE OR REPLACE FUNCTION public.get_unique_property_types()
 RETURNS TABLE(property_type text, hotel_count bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    property_type,
    COUNT(*)::bigint
  FROM hotels 
  WHERE status = 'approved' 
    AND property_type IS NOT NULL
  GROUP BY property_type
  ORDER BY property_type;
$function$;

-- Fix get_unique_property_styles function
CREATE OR REPLACE FUNCTION public.get_unique_property_styles()
 RETURNS TABLE(property_style text, hotel_count bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    style,
    COUNT(*)::bigint
  FROM hotels 
  WHERE status = 'approved' 
    AND style IS NOT NULL
  GROUP BY style
  ORDER BY style;
$function$;

-- Fix get_price_distribution function
CREATE OR REPLACE FUNCTION public.get_price_distribution()
 RETURNS TABLE(min_price integer, max_price integer, avg_price numeric, hotel_count bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    MIN(price_per_month)::integer,
    MAX(price_per_month)::integer,
    AVG(price_per_month),
    COUNT(*)::bigint
  FROM hotels 
  WHERE status = 'approved';
$function$;

-- Fix get_themes_with_counts function
CREATE OR REPLACE FUNCTION public.get_themes_with_counts()
 RETURNS TABLE(theme_id uuid, theme_name text, hotel_count bigint, level integer)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    t.id,
    t.name,
    COUNT(DISTINCT h.id)::bigint,
    t.level
  FROM themes t
  LEFT JOIN hotel_themes ht ON t.id = ht.theme_id
  LEFT JOIN hotels h ON ht.hotel_id = h.id AND h.status = 'approved'
  WHERE t.level = 1
  GROUP BY t.id, t.name, t.level
  HAVING COUNT(DISTINCT h.id) > 0
  ORDER BY t.name;
$function$;

-- Fix get_activities_with_counts function
CREATE OR REPLACE FUNCTION public.get_activities_with_counts()
 RETURNS TABLE(activity_id uuid, activity_name text, hotel_count bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    a.id,
    a.name,
    COUNT(DISTINCT h.id)::bigint
  FROM activities a
  LEFT JOIN hotel_activities ha ON a.id = ha.activity_id
  LEFT JOIN hotels h ON ha.hotel_id = h.id AND h.status = 'approved'
  GROUP BY a.id, a.name
  HAVING COUNT(DISTINCT h.id) > 0
  ORDER BY a.name;
$function$;

-- Fix assign_dual_roles_to_user function
CREATE OR REPLACE FUNCTION public.assign_dual_roles_to_user(user_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  -- This function would need to be called from an edge function or admin panel
  -- since we can't directly access auth.users from SQL migrations
  
  -- For manual execution, find the user ID and then run:
  -- INSERT INTO public.user_roles (user_id, role) 
  -- VALUES ('USER_ID_HERE', 'admin')
  -- ON CONFLICT (user_id, role) DO NOTHING;
  
  -- UPDATE public.profiles 
  -- SET is_hotel_owner = true
  -- WHERE id = 'USER_ID_HERE';
  
  RAISE NOTICE 'Function created. Manual role assignment required for user: %', user_email;
END;
$function$;

-- Fix check_package_overlap function
CREATE OR REPLACE FUNCTION public.check_package_overlap()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check for overlapping packages for the same hotel
  IF EXISTS (
    SELECT 1 FROM availability_packages
    WHERE hotel_id = NEW.hotel_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND (
      (NEW.start_date >= start_date AND NEW.start_date <= end_date) OR
      (NEW.end_date >= start_date AND NEW.end_date <= end_date) OR
      (NEW.start_date <= start_date AND NEW.end_date >= end_date)
    )
  ) THEN
    RAISE EXCEPTION 'Package dates overlap with existing package for this hotel';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix generate_agent_code function
CREATE OR REPLACE FUNCTION public.generate_agent_code(first_name text, last_name text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 1;
BEGIN
  -- Extract first syllable of first name and first two syllables of last name
  -- This is a simplified version - for production you might want more sophisticated syllable detection
  base_code := UPPER(LEFT(first_name, 3)) || UPPER(LEFT(last_name, 3));
  final_code := base_code;
  
  -- Ensure uniqueness by appending number if needed
  WHILE EXISTS (SELECT 1 FROM public.agents WHERE agent_code = final_code) LOOP
    counter := counter + 1;
    final_code := base_code || counter::TEXT;
  END LOOP;
  
  RETURN final_code;
END;
$function$;

-- Fix check_agent_hotel_eligibility function
CREATE OR REPLACE FUNCTION public.check_agent_hotel_eligibility(p_hotel_id uuid, p_agent_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  contacted_date DATE;
  registered_date DATE;
BEGIN
  -- Get the contacted date for this hotel by this agent
  SELECT ah.contacted_date 
  INTO contacted_date
  FROM public.agent_hotels ah
  WHERE ah.agent_id = p_agent_id;
  
  -- Get hotel registration date
  SELECT h.created_at::DATE 
  INTO registered_date
  FROM public.hotels h
  WHERE h.id = p_hotel_id;
  
  -- Check if hotel was registered within 30 days of being contacted
  IF contacted_date IS NOT NULL AND registered_date IS NOT NULL THEN
    RETURN (registered_date - contacted_date) <= 30 AND (registered_date - contacted_date) >= 0;
  END IF;
  
  RETURN FALSE;
END;
$function$;

-- Fix update_agent_hotel_status function
CREATE OR REPLACE FUNCTION public.update_agent_hotel_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  agent_hotel_record RECORD;
BEGIN
  -- When a hotel is approved, check if it was referred by an agent
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Find matching agent_hotels record based on email
    FOR agent_hotel_record IN 
      SELECT ah.*, a.user_id
      FROM public.agent_hotels ah
      JOIN public.agents a ON ah.agent_id = a.id
      WHERE ah.hotel_email = NEW.contact_email
      AND ah.status = 'pending'
    LOOP
      -- Check if within 30-day window
      IF public.check_agent_hotel_eligibility(NEW.id, agent_hotel_record.agent_id) THEN
        -- Update status to registered
        UPDATE public.agent_hotels 
        SET status = 'registered', 
            registered_date = CURRENT_DATE,
            updated_at = now()
        WHERE id = agent_hotel_record.id;
      ELSE
        -- Update status to expired
        UPDATE public.agent_hotels 
        SET status = 'expired',
            updated_at = now()
        WHERE id = agent_hotel_record.id;
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = role_name
  );
$function$;

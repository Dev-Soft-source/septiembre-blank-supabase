-- Fix security issues from the previous migration

-- 1. Fix function search paths
CREATE OR REPLACE FUNCTION public.generate_code_suffix()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- All letters except O
  suffix_letters TEXT := 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  random_index INTEGER;
BEGIN
  random_index := FLOOR(RANDOM() * LENGTH(suffix_letters)) + 1;
  RETURN SUBSTRING(suffix_letters FROM random_index FOR 1);
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_code_digits()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  digits TEXT := '';
  i INTEGER;
  random_digit INTEGER;
BEGIN
  FOR i IN 1..5 LOOP
    random_digit := FLOOR(RANDOM() * 10);
    digits := digits || random_digit::TEXT;
  END LOOP;
  RETURN digits;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_commission_entity_code(prefix_letter TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  max_attempts INTEGER := 100;
  attempts INTEGER := 0;
BEGIN
  LOOP
    new_code := UPPER(prefix_letter) || generate_code_digits() || generate_code_suffix();
    
    SELECT EXISTS (
      SELECT 1 FROM agents WHERE agent_code = new_code OR referral_code = new_code
      UNION ALL
      SELECT 1 FROM hotel_associations WHERE association_code = new_code OR referral_code = new_code
      UNION ALL
      SELECT 1 FROM hotels WHERE referral_code = new_code
      UNION ALL
      SELECT 1 FROM leaders WHERE referral_code = new_code
      UNION ALL
      SELECT 1 FROM profiles WHERE referral_code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Unable to generate unique code after % attempts', max_attempts;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_non_commission_entity_code(prefix_letter TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  max_attempts INTEGER := 100;
  attempts INTEGER := 0;
BEGIN
  LOOP
    new_code := UPPER(prefix_letter) || generate_code_digits();
    
    SELECT EXISTS (
      SELECT 1 FROM agents WHERE agent_code = new_code OR referral_code = new_code
      UNION ALL
      SELECT 1 FROM hotel_associations WHERE association_code = new_code OR referral_code = new_code
      UNION ALL
      SELECT 1 FROM hotels WHERE referral_code = new_code
      UNION ALL
      SELECT 1 FROM leaders WHERE referral_code = new_code
      UNION ALL
      SELECT 1 FROM profiles WHERE referral_code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Unable to generate unique code after % attempts', max_attempts;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_commission_entity_code(code TEXT, expected_prefix TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF LENGTH(code) != 7 THEN
    RETURN FALSE;
  END IF;
  
  IF LEFT(UPPER(code), 1) != UPPER(expected_prefix) THEN
    RETURN FALSE;
  END IF;
  
  IF NOT (SUBSTRING(code FROM 2 FOR 5) ~ '^[0-9]{5}$') THEN
    RETURN FALSE;
  END IF;
  
  IF NOT (RIGHT(UPPER(code), 1) ~ '^[A-Z]$' AND RIGHT(UPPER(code), 1) != 'O') THEN
    RETURN FALSE;
  END IF;
  
  IF code_contains_o(code) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_non_commission_entity_code(code TEXT, expected_prefix TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF LENGTH(code) != 6 THEN
    RETURN FALSE;
  END IF;
  
  IF LEFT(UPPER(code), 1) != UPPER(expected_prefix) THEN
    RETURN FALSE;
  END IF;
  
  IF NOT (SUBSTRING(code FROM 2 FOR 5) ~ '^[0-9]{5}$') THEN
    RETURN FALSE;
  END IF;
  
  IF code_contains_o(code) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_agent_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.agent_code IS NULL OR NEW.agent_code = '' THEN
    NEW.agent_code := generate_commission_entity_code('P');
  ELSE
    IF NOT validate_commission_entity_code(NEW.agent_code, 'P') THEN
      RAISE EXCEPTION 'Invalid agent code format. Expected: P[5 digits][letter A-Z except O]';
    END IF;
    NEW.agent_code := UPPER(NEW.agent_code);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_association_code_enhanced()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.association_code IS NULL OR NEW.association_code = '' THEN
    NEW.association_code := generate_commission_entity_code('A');
  ELSE
    IF NOT validate_commission_entity_code(NEW.association_code, 'A') THEN
      RAISE EXCEPTION 'Invalid association code format. Expected: A[5 digits][letter A-Z except O]';
    END IF;
    NEW.association_code := UPPER(NEW.association_code);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_hotel_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_commission_entity_code('H');
  ELSE
    IF NOT validate_commission_entity_code(NEW.referral_code, 'H') THEN
      RAISE EXCEPTION 'Invalid hotel code format. Expected: H[5 digits][letter A-Z except O]';
    END IF;
    NEW.referral_code := UPPER(NEW.referral_code);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_leader_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_non_commission_entity_code('L');
  ELSE
    IF NOT validate_non_commission_entity_code(NEW.referral_code, 'L') THEN
      RAISE EXCEPTION 'Invalid leader code format. Expected: L[5 digits]';
    END IF;
    NEW.referral_code := UPPER(NEW.referral_code);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_ambassador_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.ambassador_code IS NULL OR NEW.ambassador_code = '' THEN
    NEW.ambassador_code := generate_non_commission_entity_code('E');
  ELSE
    IF NOT validate_non_commission_entity_code(NEW.ambassador_code, 'E') THEN
      RAISE EXCEPTION 'Invalid ambassador code format. Expected: E[5 digits]';
    END IF;
    NEW.ambassador_code := UPPER(NEW.ambassador_code);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.migrate_existing_codes()
RETURNS TABLE(
  table_name TEXT,
  record_id UUID,
  old_code TEXT,
  new_code TEXT,
  action TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec RECORD;
  migration_log TEXT := '';
BEGIN
  FOR rec IN 
    SELECT id, agent_code FROM public.agents 
    WHERE agent_code IS NULL 
       OR agent_code = '' 
       OR NOT validate_commission_entity_code(agent_code, 'P')
       OR code_contains_o(agent_code)
  LOOP
    UPDATE public.agents 
    SET agent_code = generate_commission_entity_code('P')
    WHERE id = rec.id
    RETURNING agent_code INTO migration_log;
    
    RETURN QUERY SELECT 'agents'::TEXT, rec.id, rec.agent_code, migration_log, 'updated'::TEXT;
  END LOOP;

  FOR rec IN 
    SELECT id, association_code FROM public.hotel_associations 
    WHERE association_code IS NULL 
       OR association_code = '' 
       OR NOT validate_commission_entity_code(association_code, 'A')
       OR code_contains_o(association_code)
  LOOP
    UPDATE public.hotel_associations 
    SET association_code = generate_commission_entity_code('A')
    WHERE id = rec.id
    RETURNING association_code INTO migration_log;
    
    RETURN QUERY SELECT 'hotel_associations'::TEXT, rec.id, rec.association_code, migration_log, 'updated'::TEXT;
  END LOOP;

  FOR rec IN 
    SELECT id, referral_code FROM public.hotels 
    WHERE referral_code IS NULL 
       OR referral_code = '' 
       OR NOT validate_commission_entity_code(referral_code, 'H')
       OR code_contains_o(referral_code)
  LOOP
    UPDATE public.hotels 
    SET referral_code = generate_commission_entity_code('H')
    WHERE id = rec.id
    RETURNING referral_code INTO migration_log;
    
    RETURN QUERY SELECT 'hotels'::TEXT, rec.id, rec.referral_code, migration_log, 'updated'::TEXT;
  END LOOP;

  FOR rec IN 
    SELECT id, referral_code FROM public.leaders 
    WHERE referral_code IS NULL 
       OR referral_code = '' 
       OR NOT validate_non_commission_entity_code(referral_code, 'L')
       OR code_contains_o(referral_code)
  LOOP
    UPDATE public.leaders 
    SET referral_code = generate_non_commission_entity_code('L')
    WHERE id = rec.id
    RETURNING referral_code INTO migration_log;
    
    RETURN QUERY SELECT 'leaders'::TEXT, rec.id, rec.referral_code, migration_log, 'updated'::TEXT;
  END LOOP;

  FOR rec IN 
    SELECT id, ambassador_code FROM public.ambassadors 
    WHERE ambassador_code IS NULL 
       OR ambassador_code = '' 
       OR NOT validate_non_commission_entity_code(ambassador_code, 'E')
       OR code_contains_o(ambassador_code)
  LOOP
    UPDATE public.ambassadors 
    SET ambassador_code = generate_non_commission_entity_code('E')
    WHERE id = rec.id
    RETURNING ambassador_code INTO migration_log;
    
    RETURN QUERY SELECT 'ambassadors'::TEXT, rec.id, rec.ambassador_code, migration_log, 'updated'::TEXT;
  END LOOP;

END;
$$;

-- 2. Add missing RLS policies for ambassadors (admin access)
CREATE POLICY "Admins can manage all ambassadors"
ON public.ambassadors FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 3. Add admin policies for code management if needed
CREATE POLICY "Admins can view all agents"
ON public.agents FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all associations"  
ON public.hotel_associations FOR SELECT
USING (is_admin(auth.uid()));

-- 4. Ensure proper uppercase enforcement on updates
CREATE OR REPLACE FUNCTION public.enforce_uppercase_codes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Uppercase all code fields
  IF TG_TABLE_NAME = 'agents' THEN
    NEW.agent_code := UPPER(NEW.agent_code);
    IF NEW.referral_code IS NOT NULL THEN
      NEW.referral_code := UPPER(NEW.referral_code);
    END IF;
  ELSIF TG_TABLE_NAME = 'hotel_associations' THEN
    NEW.association_code := UPPER(NEW.association_code);
    IF NEW.referral_code IS NOT NULL THEN
      NEW.referral_code := UPPER(NEW.referral_code);
    END IF;
  ELSIF TG_TABLE_NAME = 'hotels' THEN
    IF NEW.referral_code IS NOT NULL THEN
      NEW.referral_code := UPPER(NEW.referral_code);
    END IF;
  ELSIF TG_TABLE_NAME = 'leaders' THEN
    NEW.referral_code := UPPER(NEW.referral_code);
  ELSIF TG_TABLE_NAME = 'ambassadors' THEN
    NEW.ambassador_code := UPPER(NEW.ambassador_code);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply uppercase triggers
CREATE TRIGGER enforce_uppercase_codes_agents
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION enforce_uppercase_codes();

CREATE TRIGGER enforce_uppercase_codes_associations
  BEFORE UPDATE ON public.hotel_associations
  FOR EACH ROW EXECUTE FUNCTION enforce_uppercase_codes();

CREATE TRIGGER enforce_uppercase_codes_hotels
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION enforce_uppercase_codes();

CREATE TRIGGER enforce_uppercase_codes_leaders
  BEFORE UPDATE ON public.leaders
  FOR EACH ROW EXECUTE FUNCTION enforce_uppercase_codes();

CREATE TRIGGER enforce_uppercase_codes_ambassadors
  BEFORE UPDATE ON public.ambassadors
  FOR EACH ROW EXECUTE FUNCTION enforce_uppercase_codes();
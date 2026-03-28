-- Enhanced identification code system with commission-based formats
-- 1. Create code generation functions with O-letter restriction

-- Function to generate suffix letter (A-Z excluding O)
CREATE OR REPLACE FUNCTION public.generate_code_suffix()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to generate 5-digit number ensuring no O digits
CREATE OR REPLACE FUNCTION public.generate_code_digits()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  digits TEXT := '';
  i INTEGER;
  random_digit INTEGER;
BEGIN
  FOR i IN 1..5 LOOP
    -- Generate random digit 0-9 
    random_digit := FLOOR(RANDOM() * 10);
    digits := digits || random_digit::TEXT;
  END LOOP;
  RETURN digits;
END;
$$;

-- Function to check if code contains letter O
CREATE OR REPLACE FUNCTION public.code_contains_o(code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT UPPER(code) LIKE '%O%';
$$;

-- Function to generate unique code for entities WITH commissions (7 chars: PREFIX + 5 digits + suffix)
CREATE OR REPLACE FUNCTION public.generate_commission_entity_code(prefix_letter TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  max_attempts INTEGER := 100;
  attempts INTEGER := 0;
BEGIN
  LOOP
    -- Generate code: PREFIX + 5 digits + suffix letter
    new_code := UPPER(prefix_letter) || generate_code_digits() || generate_code_suffix();
    
    -- Check uniqueness across all tables
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

-- Function to generate unique code for entities WITHOUT commissions (6 chars: PREFIX + 5 digits)
CREATE OR REPLACE FUNCTION public.generate_non_commission_entity_code(prefix_letter TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  max_attempts INTEGER := 100;
  attempts INTEGER := 0;
BEGIN
  LOOP
    -- Generate code: PREFIX + 5 digits (no suffix)
    new_code := UPPER(prefix_letter) || generate_code_digits();
    
    -- Check uniqueness across all tables
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

-- 2. Create ambassadors table for E-prefix entities
CREATE TABLE IF NOT EXISTS public.ambassadors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ambassador_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  region TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on ambassadors
ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;

-- RLS policies for ambassadors
CREATE POLICY "Users can view their own ambassador data"
ON public.ambassadors FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own ambassador data"
ON public.ambassadors FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow ambassador registration"
ON public.ambassadors FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Update existing tables to ensure proper code formats

-- Add referral_code to hotels if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'hotels' 
    AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE public.hotels ADD COLUMN referral_code TEXT;
  END IF;
END $$;

-- 4. Code validation functions
CREATE OR REPLACE FUNCTION public.validate_commission_entity_code(code TEXT, expected_prefix TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Check format: [PREFIX][5 digits][suffix letter]
  IF LENGTH(code) != 7 THEN
    RETURN FALSE;
  END IF;
  
  -- Check prefix
  IF LEFT(UPPER(code), 1) != UPPER(expected_prefix) THEN
    RETURN FALSE;
  END IF;
  
  -- Check middle 5 characters are digits
  IF NOT (SUBSTRING(code FROM 2 FOR 5) ~ '^[0-9]{5}$') THEN
    RETURN FALSE;
  END IF;
  
  -- Check suffix is letter A-Z (excluding O)
  IF NOT (RIGHT(UPPER(code), 1) ~ '^[A-Z]$' AND RIGHT(UPPER(code), 1) != 'O') THEN
    RETURN FALSE;
  END IF;
  
  -- Check no O letters anywhere
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
AS $$
BEGIN
  -- Check format: [PREFIX][5 digits]
  IF LENGTH(code) != 6 THEN
    RETURN FALSE;
  END IF;
  
  -- Check prefix
  IF LEFT(UPPER(code), 1) != UPPER(expected_prefix) THEN
    RETURN FALSE;
  END IF;
  
  -- Check remaining 5 characters are digits
  IF NOT (SUBSTRING(code FROM 2 FOR 5) ~ '^[0-9]{5}$') THEN
    RETURN FALSE;
  END IF;
  
  -- Check no O letters anywhere
  IF code_contains_o(code) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- 5. Trigger functions to auto-generate codes
CREATE OR REPLACE FUNCTION public.set_agent_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- P prefix for Promoters (agents) - commission entity
  IF NEW.agent_code IS NULL OR NEW.agent_code = '' THEN
    NEW.agent_code := generate_commission_entity_code('P');
  ELSE
    -- Validate manually entered code
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
AS $$
BEGIN
  -- A prefix for Associations - commission entity
  IF NEW.association_code IS NULL OR NEW.association_code = '' THEN
    NEW.association_code := generate_commission_entity_code('A');
  ELSE
    -- Validate manually entered code
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
AS $$
BEGIN
  -- H prefix for Hotels - commission entity
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_commission_entity_code('H');
  ELSE
    -- Validate manually entered code
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
AS $$
BEGIN
  -- L prefix for Leaders - non-commission entity
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_non_commission_entity_code('L');
  ELSE
    -- Validate manually entered code
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
AS $$
BEGIN
  -- E prefix for Ambassadors - non-commission entity
  IF NEW.ambassador_code IS NULL OR NEW.ambassador_code = '' THEN
    NEW.ambassador_code := generate_non_commission_entity_code('E');
  ELSE
    -- Validate manually entered code
    IF NOT validate_non_commission_entity_code(NEW.ambassador_code, 'E') THEN
      RAISE EXCEPTION 'Invalid ambassador code format. Expected: E[5 digits]';
    END IF;
    NEW.ambassador_code := UPPER(NEW.ambassador_code);
  END IF;
  
  RETURN NEW;
END;
$$;

-- 6. Create/update triggers
DROP TRIGGER IF EXISTS set_agent_code_trigger ON public.agents;
CREATE TRIGGER set_agent_code_trigger
  BEFORE INSERT OR UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION set_agent_code();

DROP TRIGGER IF EXISTS set_association_code_trigger ON public.hotel_associations;
CREATE TRIGGER set_association_code_trigger
  BEFORE INSERT OR UPDATE ON public.hotel_associations
  FOR EACH ROW EXECUTE FUNCTION set_association_code_enhanced();

DROP TRIGGER IF EXISTS set_hotel_referral_code_trigger ON public.hotels;
CREATE TRIGGER set_hotel_referral_code_trigger
  BEFORE INSERT OR UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION set_hotel_referral_code();

DROP TRIGGER IF EXISTS set_leader_code_trigger ON public.leaders;
CREATE TRIGGER set_leader_code_trigger
  BEFORE INSERT OR UPDATE ON public.leaders
  FOR EACH ROW EXECUTE FUNCTION set_leader_code();

DROP TRIGGER IF EXISTS set_ambassador_code_trigger ON public.ambassadors;
CREATE TRIGGER set_ambassador_code_trigger
  BEFORE INSERT OR UPDATE ON public.ambassadors
  FOR EACH ROW EXECUTE FUNCTION set_ambassador_code();

-- 7. Migration function to update existing records
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
AS $$
DECLARE
  rec RECORD;
  migration_log TEXT := '';
BEGIN
  -- Update agents with invalid codes
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

  -- Update hotel associations with invalid codes
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

  -- Update hotels with invalid or missing referral codes
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

  -- Update leaders with invalid codes
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

  -- Update ambassadors with invalid codes (if any exist)
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

-- 8. Execute migration and log results
DO $$
DECLARE
  migration_result RECORD;
  total_updated INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting code format migration...';
  
  FOR migration_result IN SELECT * FROM migrate_existing_codes() LOOP
    RAISE NOTICE 'Updated % table - ID: %, Old: %, New: %', 
      migration_result.table_name, 
      migration_result.record_id, 
      COALESCE(migration_result.old_code, 'NULL'), 
      migration_result.new_code;
    total_updated := total_updated + 1;
  END LOOP;
  
  RAISE NOTICE 'Migration complete. Total records updated: %', total_updated;
END $$;
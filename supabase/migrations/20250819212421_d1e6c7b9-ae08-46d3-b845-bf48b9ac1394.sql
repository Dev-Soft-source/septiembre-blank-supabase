-- DROP AND RECREATE FUNCTIONS WITH PROPER SIGNATURES
-- Fix the function signature conflicts

-- ========================================
-- DROP EXISTING FUNCTIONS WITH CONFLICTING SIGNATURES
-- ========================================

DROP FUNCTION IF EXISTS public.generate_non_commission_entity_code(text);
DROP FUNCTION IF EXISTS public.generate_commission_entity_code(text);
DROP FUNCTION IF EXISTS public.validate_non_commission_entity_code(text, text);
DROP FUNCTION IF EXISTS public.validate_commission_entity_code(text, text);

-- ========================================
-- RECREATE FUNCTIONS WITH PROPER SEARCH_PATH
-- ========================================

-- Create helper functions with proper search_path
CREATE FUNCTION public.generate_non_commission_entity_code(prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  random_code TEXT;
  final_code TEXT;
BEGIN
  -- Generate format: [PREFIX][5 digits]
  random_code := prefix || LPAD((FLOOR(RANDOM() * 100000))::TEXT, 5, '0');
  final_code := random_code;
  
  RETURN UPPER(final_code);
END;
$$;

CREATE FUNCTION public.generate_commission_entity_code(prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  random_code TEXT;
  letter_code TEXT;
  final_code TEXT;
BEGIN
  -- Generate format: [PREFIX][5 digits][letter A-Z except O]
  random_code := prefix || LPAD((FLOOR(RANDOM() * 100000))::TEXT, 5, '0');
  -- Generate random letter A-Z except O
  letter_code := CHR(65 + (FLOOR(RANDOM() * 25))::INTEGER); -- A-Z range
  IF letter_code = 'O' THEN letter_code := 'P'; END IF; -- Skip O
  
  final_code := random_code || letter_code;
  
  RETURN UPPER(final_code);
END;
$$;

CREATE FUNCTION public.validate_non_commission_entity_code(code text, expected_prefix text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
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
  
  RETURN TRUE;
END;
$$;

CREATE FUNCTION public.validate_commission_entity_code(code text, expected_prefix text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  -- Check format: [PREFIX][5 digits][letter A-Z except O]
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
  
  -- Check last character is letter A-Z except O
  IF NOT (RIGHT(UPPER(code), 1) ~ '^[A-NP-Z]$') THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- ========================================
-- SECURITY COMPLETION LOG
-- ========================================

-- Log security completion
COMMENT ON FUNCTION public.generate_non_commission_entity_code(text) IS 'Security hardened with proper search_path';
COMMENT ON FUNCTION public.generate_commission_entity_code(text) IS 'Security hardened with proper search_path';
COMMENT ON FUNCTION public.validate_non_commission_entity_code(text, text) IS 'Security hardened with proper search_path';
COMMENT ON FUNCTION public.validate_commission_entity_code(text, text) IS 'Security hardened with proper search_path';
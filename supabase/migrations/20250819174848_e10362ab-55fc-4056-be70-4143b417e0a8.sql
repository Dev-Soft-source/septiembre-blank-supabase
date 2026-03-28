-- Create integrity test support tables and functions
-- This supports comprehensive business logic testing while respecting RLS

-- Test execution log table for tracking test results
CREATE TABLE IF NOT EXISTS public.integrity_test_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_suite TEXT NOT NULL,
  test_case TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PASS', 'FAIL', 'SKIP', 'ERROR')),
  details JSONB,
  executed_by UUID REFERENCES auth.users(id),
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  execution_time_ms INTEGER
);

-- Enable RLS on test logs
ALTER TABLE public.integrity_test_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view test logs
CREATE POLICY "Admins can manage integrity test logs" ON public.integrity_test_logs
FOR ALL USING (is_admin_user());

-- Function to safely create test users with different roles
CREATE OR REPLACE FUNCTION public.create_test_user_profile(
  p_email TEXT,
  p_role TEXT,
  p_first_name TEXT DEFAULT 'Test',
  p_last_name TEXT DEFAULT 'User'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Generate a test UUID (simulated user)
  v_user_id := gen_random_uuid();
  
  -- Insert test profile
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (v_user_id, p_first_name, p_last_name, p_email);
  
  -- Insert role
  INSERT INTO public.user_roles (user_id, role, email)
  VALUES (v_user_id, p_role, p_email);
  
  RETURN v_user_id;
END;
$$;

-- Function to clean up test data
CREATE OR REPLACE FUNCTION public.cleanup_test_data(p_test_session_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Clean up test profiles (those with email starting with 'test_')
  DELETE FROM public.profiles 
  WHERE email LIKE 'test_%' OR first_name = 'Test' AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Clean up test bookings
  DELETE FROM public.bookings 
  WHERE created_at > NOW() - INTERVAL '1 hour'
  AND (guest_count = 999 OR total_price = 12345); -- Test markers
  
  -- Clean up test group memberships
  DELETE FROM public.group_memberships 
  WHERE group_name LIKE 'TEST_%';
  
  -- Clean up test commissions
  DELETE FROM public.booking_commissions 
  WHERE created_at > NOW() - INTERVAL '1 hour'
  AND referred_by LIKE 'TEST_%';
  
  RAISE LOG 'Test cleanup completed for session: %', p_test_session_id;
END;
$$;

-- Function to get booking availability atomically (for testing race conditions)
CREATE OR REPLACE FUNCTION public.test_availability_atomic_booking(
  p_package_id UUID,
  p_rooms_needed INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_available_rooms INTEGER;
  v_result JSONB;
BEGIN
  -- Lock and check availability
  SELECT available_rooms INTO v_available_rooms
  FROM availability_packages
  WHERE id = p_package_id
  FOR UPDATE;
  
  IF v_available_rooms IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Package not found');
  END IF;
  
  IF v_available_rooms < p_rooms_needed THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Insufficient rooms',
      'available', v_available_rooms,
      'requested', p_rooms_needed
    );
  END IF;
  
  -- Simulate booking by decrementing
  UPDATE availability_packages
  SET available_rooms = available_rooms - p_rooms_needed,
      updated_at = NOW()
  WHERE id = p_package_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'previous_available', v_available_rooms,
    'rooms_booked', p_rooms_needed,
    'remaining_available', v_available_rooms - p_rooms_needed
  );
END;
$$;

-- Function to validate commission calculation
CREATE OR REPLACE FUNCTION public.validate_commission_calculation(
  p_booking_amount INTEGER,
  p_commission_percent NUMERIC
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_expected_commission INTEGER;
  v_commission_usd INTEGER;
BEGIN
  -- Calculate expected commission
  v_expected_commission := FLOOR(p_booking_amount * (p_commission_percent / 100));
  
  RETURN jsonb_build_object(
    'booking_amount', p_booking_amount,
    'commission_percent', p_commission_percent,
    'expected_commission_usd', v_expected_commission,
    'calculation_formula', format('FLOOR(%s * (%s / 100)) = %s', 
      p_booking_amount, p_commission_percent, v_expected_commission)
  );
END;
$$;

COMMENT ON TABLE public.integrity_test_logs IS 'Stores results of system integrity tests for business logic validation';
COMMENT ON FUNCTION public.create_test_user_profile IS 'Creates test user profiles for integrity testing while respecting RLS';
COMMENT ON FUNCTION public.cleanup_test_data IS 'Safely removes test data created during integrity testing';
COMMENT ON FUNCTION public.test_availability_atomic_booking IS 'Tests atomic booking operations for availability packages';
COMMENT ON FUNCTION public.validate_commission_calculation IS 'Validates commission calculation logic for different scenarios';
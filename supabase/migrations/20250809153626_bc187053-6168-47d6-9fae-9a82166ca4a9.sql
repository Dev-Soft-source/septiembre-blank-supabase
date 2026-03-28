-- Implement Single-Source Rule for Monetary Commissions
-- Principle: A booking can have at most one monetary commission source

-- Add commission source tracking to bookings table
ALTER TABLE public.bookings 
ADD COLUMN commission_source_type TEXT CHECK (commission_source_type IN ('association', 'promoter', 'hotel_referrer')),
ADD COLUMN commission_source_id UUID;

-- Add constraint: both NULL or both NOT NULL (cannot have one without the other)
ALTER TABLE public.bookings 
ADD CONSTRAINT commission_source_consistency 
CHECK (
  (commission_source_type IS NULL AND commission_source_id IS NULL) OR 
  (commission_source_type IS NOT NULL AND commission_source_id IS NOT NULL)
);

-- Ensure booking_commissions has unique booking_id constraint
-- First check if the constraint already exists
DO $$ 
BEGIN
  -- Add unique constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'booking_commissions_booking_id_unique'
  ) THEN
    ALTER TABLE public.booking_commissions 
    ADD CONSTRAINT booking_commissions_booking_id_unique UNIQUE (booking_id);
  END IF;
END $$;

-- Create audit table for commission operations
CREATE TABLE IF NOT EXISTS public.commission_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('CREATE', 'ATTEMPT_DUPLICATE', 'UPDATE', 'DELETE')),
  commission_source_type TEXT,
  commission_source_id UUID,
  actor_id UUID,
  previous_state JSONB,
  new_state JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Enable RLS on audit table
ALTER TABLE public.commission_audit ENABLE ROW LEVEL SECURITY;

-- RLS policy for commission audit (admin only)
CREATE POLICY "Admins can view commission audit" 
ON public.commission_audit 
FOR SELECT 
USING (is_admin_user());

-- Policy to allow system inserts
CREATE POLICY "System can insert commission audit" 
ON public.commission_audit 
FOR INSERT 
WITH CHECK (true);

-- Function to audit commission operations
CREATE OR REPLACE FUNCTION public.audit_commission_operation(
  p_booking_id UUID,
  p_operation TEXT,
  p_commission_source_type TEXT DEFAULT NULL,
  p_commission_source_id UUID DEFAULT NULL,
  p_previous_state JSONB DEFAULT NULL,
  p_new_state JSONB DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.commission_audit (
    booking_id,
    operation,
    commission_source_type,
    commission_source_id,
    actor_id,
    previous_state,
    new_state,
    notes
  ) VALUES (
    p_booking_id,
    p_operation,
    p_commission_source_type,
    p_commission_source_id,
    auth.uid(),
    p_previous_state,
    p_new_state,
    p_notes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to create commission with single-source enforcement
CREATE OR REPLACE FUNCTION public.create_booking_commission(
  p_booking_id UUID,
  p_commission_source_type TEXT,
  p_commission_source_id UUID,
  p_commission_usd NUMERIC,
  p_commission_percent NUMERIC,
  p_referred_by TEXT
)
RETURNS JSONB AS $$
DECLARE
  existing_commission RECORD;
  commission_result JSONB;
BEGIN
  -- Check if booking already has a commission
  SELECT * INTO existing_commission 
  FROM public.booking_commissions 
  WHERE booking_id = p_booking_id;
  
  IF existing_commission IS NOT NULL THEN
    -- Audit the duplicate attempt
    PERFORM public.audit_commission_operation(
      p_booking_id,
      'ATTEMPT_DUPLICATE',
      p_commission_source_type,
      p_commission_source_id,
      row_to_json(existing_commission)::jsonb,
      NULL,
      'Attempt to create duplicate commission blocked'
    );
    
    -- Return error
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'BUSINESS_RULE_VIOLATION',
        'message', jsonb_build_object(
          'en', 'This booking already has a commission source.',
          'es', 'Esta reserva ya tiene un origen de comisión.',
          'pt', 'Esta reserva já possui uma origem de comissão.',
          'ro', 'Această rezervare are deja o sursă de comision.'
        )
      ),
      'timestamp', NOW()
    );
  END IF;
  
  -- Create the commission (idempotent with ON CONFLICT)
  INSERT INTO public.booking_commissions (
    booking_id,
    referred_by,
    commission_usd,
    commission_percent
  ) VALUES (
    p_booking_id,
    p_referred_by,
    p_commission_usd,
    p_commission_percent
  ) ON CONFLICT (booking_id) DO NOTHING;
  
  -- Update booking with commission source info
  UPDATE public.bookings 
  SET 
    commission_source_type = p_commission_source_type,
    commission_source_id = p_commission_source_id,
    updated_at = NOW()
  WHERE id = p_booking_id;
  
  -- Get the created commission for audit
  SELECT * INTO existing_commission 
  FROM public.booking_commissions 
  WHERE booking_id = p_booking_id;
  
  -- Audit successful creation
  PERFORM public.audit_commission_operation(
    p_booking_id,
    'CREATE',
    p_commission_source_type,
    p_commission_source_id,
    NULL,
    row_to_json(existing_commission)::jsonb,
    'Commission created successfully'
  );
  
  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'data', row_to_json(existing_commission),
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
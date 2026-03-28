-- Add Stripe-related fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_timestamp TIMESTAMPTZ;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON public.bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
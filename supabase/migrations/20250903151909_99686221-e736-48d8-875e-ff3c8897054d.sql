-- Phase 3: Commission System Consolidation
-- Simplify commission logic by restructuring tables

-- First, let's restructure the booking_commissions table to be the single source of truth
-- Drop and recreate with consolidated fields
DROP TABLE IF EXISTS booking_commissions CASCADE;

CREATE TABLE booking_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  referral_type TEXT NOT NULL CHECK (referral_type IN ('association', 'agent', 'leader', 'hotel_referrer')),
  referral_id UUID NOT NULL, -- The ID of the entity that gets the commission
  percentage NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  amount_usd INTEGER NOT NULL CHECK (amount_usd >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure only one commission per booking
  UNIQUE(booking_id)
);

-- Create a new payments table for tracking payouts
CREATE TABLE payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_type TEXT NOT NULL CHECK (role_type IN ('association', 'agent', 'leader', 'hotel')),
  role_id UUID NOT NULL,
  total_paid INTEGER NOT NULL DEFAULT 0,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE booking_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for booking_commissions
CREATE POLICY "Admins can manage all commissions" ON booking_commissions
FOR ALL USING (is_admin_bypass_rls())
WITH CHECK (is_admin_bypass_rls());

CREATE POLICY "Users can view their own commissions" ON booking_commissions
FOR SELECT USING (
  -- Hotel owners can see commissions for their hotels
  EXISTS (SELECT 1 FROM hotels WHERE hotels.id = booking_commissions.hotel_id AND hotels.owner_id = auth.uid())
  OR
  -- Users can see commissions where they are the booking user
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_commissions.booking_id AND bookings.user_id = auth.uid())
);

-- RLS policies for payments
CREATE POLICY "Admins can manage all payments" ON payments
FOR ALL USING (is_admin_bypass_rls())
WITH CHECK (is_admin_bypass_rls());

CREATE POLICY "Entities can view their own payments" ON payments
FOR SELECT USING (
  -- Hotel owners can see their hotel payments
  (role_type = 'hotel' AND role_id IN (SELECT id FROM hotels WHERE owner_id = auth.uid()))
  OR
  -- Associations can see their payments
  (role_type = 'association' AND role_id IN (SELECT id FROM associations WHERE user_id = auth.uid()))
  OR
  -- Agents can see their payments
  (role_type = 'agent' AND role_id IN (SELECT id FROM agents WHERE user_id = auth.uid()))
  OR
  -- Leaders can see their payments
  (role_type = 'leader' AND role_id IN (SELECT id FROM leaders WHERE user_id = auth.uid()))
);

-- Add indexes for performance
CREATE INDEX idx_booking_commissions_booking_id ON booking_commissions(booking_id);
CREATE INDEX idx_booking_commissions_hotel_id ON booking_commissions(hotel_id);
CREATE INDEX idx_booking_commissions_referral ON booking_commissions(referral_type, referral_id);
CREATE INDEX idx_payments_role ON payments(role_type, role_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Add updated_at trigger for booking_commissions
CREATE TRIGGER update_booking_commissions_updated_at
  BEFORE UPDATE ON booking_commissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for payments
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Now remove the redundant commission tables
DROP TABLE IF EXISTS agent_commissions CASCADE;
DROP TABLE IF EXISTS commission_audit CASCADE;
DROP TABLE IF EXISTS commission_notification_logs CASCADE;
DROP TABLE IF EXISTS free_nights_rewards CASCADE;
DROP TABLE IF EXISTS leader_bonuses CASCADE;
DROP TABLE IF EXISTS hotel_commission_link CASCADE;

-- Log the consolidation
COMMENT ON TABLE booking_commissions IS 'Phase 3: Consolidated commission system - single source of truth for all commissions';
COMMENT ON TABLE payments IS 'Phase 3: Payment history for all commission entities';
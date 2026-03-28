-- Create leaders table
CREATE TABLE public.leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on referral_code for fast lookups
CREATE INDEX idx_leaders_referral_code ON public.leaders(referral_code);
CREATE INDEX idx_leaders_user_id ON public.leaders(user_id);

-- Enable RLS
ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;

-- RLS policies for leaders
CREATE POLICY "Leaders can view their own data" ON public.leaders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Leaders can insert their own data" ON public.leaders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Leaders can update their own data" ON public.leaders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public can view leader referral codes" ON public.leaders
  FOR SELECT USING (true);

-- Create leader_invitations table
CREATE TABLE public.leader_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_id UUID NOT NULL REFERENCES public.leaders(id) ON DELETE CASCADE,
  invited_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_leader_invitations_leader_id ON public.leader_invitations(leader_id);
CREATE INDEX idx_leader_invitations_status ON public.leader_invitations(status);

-- Enable RLS
ALTER TABLE public.leader_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for leader_invitations
CREATE POLICY "Leaders can manage their invitations" ON public.leader_invitations
  FOR ALL USING (
    leader_id IN (SELECT id FROM public.leaders WHERE user_id = auth.uid())
  );

-- Create leader_bonuses table
CREATE TABLE public.leader_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_id UUID NOT NULL REFERENCES public.leaders(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  bonus_usd DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_leader_bonuses_leader_id ON public.leader_bonuses(leader_id);
CREATE INDEX idx_leader_bonuses_booking_id ON public.leader_bonuses(booking_id);

-- Enable RLS
ALTER TABLE public.leader_bonuses ENABLE ROW LEVEL SECURITY;

-- RLS policies for leader_bonuses
CREATE POLICY "Leaders can view their bonuses" ON public.leader_bonuses
  FOR SELECT USING (
    leader_id IN (SELECT id FROM public.leaders WHERE user_id = auth.uid())
  );

CREATE POLICY "System can insert bonuses" ON public.leader_bonuses
  FOR INSERT WITH CHECK (true);

-- Add referral_code_used column to bookings table
ALTER TABLE public.bookings ADD COLUMN referral_code_used TEXT;

-- Create index on referral_code_used
CREATE INDEX idx_bookings_referral_code_used ON public.bookings(referral_code_used);

-- Create function to handle leader commission calculation
CREATE OR REPLACE FUNCTION public.calculate_leader_commission()
RETURNS TRIGGER AS $$
DECLARE
  v_leader_id UUID;
  v_commission_amount DECIMAL(12,2);
BEGIN
  -- Only process if referral code was used and booking is confirmed
  IF NEW.referral_code_used IS NOT NULL AND NEW.status = 'confirmed' THEN
    -- Find the leader by referral code
    SELECT id INTO v_leader_id
    FROM public.leaders
    WHERE referral_code = NEW.referral_code_used;
    
    IF v_leader_id IS NOT NULL THEN
      -- Calculate 5% commission
      v_commission_amount := (NEW.total_price * 0.05);
      
      -- Insert leader bonus
      INSERT INTO public.leader_bonuses (leader_id, booking_id, bonus_usd)
      VALUES (v_leader_id, NEW.id, v_commission_amount);
      
      -- Insert into booking_commissions for tracking
      INSERT INTO public.booking_commissions (booking_id, referred_by, commission_usd, commission_percent)
      VALUES (NEW.id, NEW.referral_code_used, v_commission_amount, 5.0)
      ON CONFLICT (booking_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for leader commission calculation
CREATE TRIGGER trigger_calculate_leader_commission
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_leader_commission();

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_leader_referral_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code in format LL-XXXX (e.g., LL-1234)
    v_code := 'LL-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.leaders WHERE referral_code = v_code) INTO v_exists;
    
    -- Exit loop if code is unique
    IF NOT v_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-generate referral code
CREATE OR REPLACE FUNCTION public.set_leader_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_leader_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_leader_referral_code
  BEFORE INSERT ON public.leaders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_leader_referral_code();
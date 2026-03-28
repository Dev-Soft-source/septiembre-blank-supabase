-- Create agents table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bank_account TEXT NOT NULL,
  total_earned DECIMAL(10,2) DEFAULT 0,
  total_paid DECIMAL(10,2) DEFAULT 0,
  total_pending DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agent_hotels table to track contacted hotels
CREATE TABLE public.agent_hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  hotel_name TEXT NOT NULL,
  hotel_email TEXT NOT NULL,
  country TEXT NOT NULL,
  contacted_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'registered', 'expired')),
  registered_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agent_commissions table to track commission payments
CREATE TABLE public.agent_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL, -- e.g., 0.005 for 0.5%
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agents table
CREATE POLICY "Agents can view their own data" 
ON public.agents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Agents can update their own data" 
ON public.agents FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Allow agent registration" 
ON public.agents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all agents" 
ON public.agents FOR ALL 
USING (has_role('admin'));

-- RLS Policies for agent_hotels table
CREATE POLICY "Agents can manage their own hotels" 
ON public.agent_hotels FOR ALL 
USING (agent_id IN (
  SELECT id FROM public.agents WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can view all agent hotels" 
ON public.agent_hotels FOR SELECT 
USING (has_role('admin'));

-- RLS Policies for agent_commissions table
CREATE POLICY "Agents can view their own commissions" 
ON public.agent_commissions FOR SELECT 
USING (agent_id IN (
  SELECT id FROM public.agents WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage all commissions" 
ON public.agent_commissions FOR ALL 
USING (has_role('admin'));

-- Create function to generate agent code
CREATE OR REPLACE FUNCTION public.generate_agent_code(first_name TEXT, last_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
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
$$;

-- Create function to check 30-day window for hotel registration
CREATE OR REPLACE FUNCTION public.check_agent_hotel_eligibility(p_hotel_id UUID, p_agent_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
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
$$;

-- Create trigger to update agent_hotels status when hotel is registered
CREATE OR REPLACE FUNCTION public.update_agent_hotel_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
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
$$;

-- Create trigger for hotel status updates
CREATE TRIGGER update_agent_hotel_status_trigger
  AFTER UPDATE ON public.hotels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agent_hotel_status();

-- Create indexes for performance
CREATE INDEX idx_agents_user_id ON public.agents(user_id);
CREATE INDEX idx_agents_agent_code ON public.agents(agent_code);
CREATE INDEX idx_agent_hotels_agent_id ON public.agent_hotels(agent_id);
CREATE INDEX idx_agent_hotels_email ON public.agent_hotels(hotel_email);
CREATE INDEX idx_agent_commissions_agent_id ON public.agent_commissions(agent_id);

-- Add trigger for automatic updated_at timestamps
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_hotels_updated_at
  BEFORE UPDATE ON public.agent_hotels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_commissions_updated_at
  BEFORE UPDATE ON public.agent_commissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
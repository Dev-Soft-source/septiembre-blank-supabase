-- Inter-panel communication tables for User-GroupLeader and Hotel-GroupLeader connections

-- Table for users to join group leader groups
CREATE TABLE public.group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'active', 'inactive')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, leader_id, group_name)
);

-- Table for hotel-group leader deal negotiations
CREATE TABLE public.hotel_group_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_title TEXT NOT NULL,
  group_size INTEGER NOT NULL DEFAULT 1,
  proposed_dates TEXT,
  special_price DECIMAL(10,2),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'accepted', 'declined', 'expired')),
  hotel_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for group leader booking integrations
CREATE TABLE public.group_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  total_participants INTEGER NOT NULL DEFAULT 1,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'cancelled', 'completed')),
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_group_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for group_memberships
CREATE POLICY "Users can view their own group memberships"
  ON public.group_memberships
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Leaders can view their group memberships"
  ON public.group_memberships
  FOR SELECT
  USING (auth.uid() = leader_id);

CREATE POLICY "Users can create group memberships"
  ON public.group_memberships
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Leaders can update group membership status"
  ON public.group_memberships
  FOR UPDATE
  USING (auth.uid() = leader_id);

CREATE POLICY "Admins can manage all group memberships"
  ON public.group_memberships
  FOR ALL
  USING (has_role('admin'));

-- RLS Policies for hotel_group_deals
CREATE POLICY "Hotels can view deals for their properties"
  ON public.hotel_group_deals
  FOR SELECT
  USING (
    hotel_id IN (
      SELECT id FROM public.hotels WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can view their own deals"
  ON public.hotel_group_deals
  FOR SELECT
  USING (auth.uid() = leader_id);

CREATE POLICY "Leaders can create deals"
  ON public.hotel_group_deals
  FOR INSERT
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Hotels can update deal responses"
  ON public.hotel_group_deals
  FOR UPDATE
  USING (
    hotel_id IN (
      SELECT id FROM public.hotels WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can update their own deals"
  ON public.hotel_group_deals
  FOR UPDATE
  USING (auth.uid() = leader_id);

CREATE POLICY "Admins can manage all hotel group deals"
  ON public.hotel_group_deals
  FOR ALL
  USING (has_role('admin'));

-- RLS Policies for group_bookings
CREATE POLICY "Leaders can manage their group bookings"
  ON public.group_bookings
  FOR ALL
  USING (auth.uid() = leader_id);

CREATE POLICY "Hotels can view bookings for their properties"
  ON public.group_bookings
  FOR SELECT
  USING (
    hotel_id IN (
      SELECT id FROM public.hotels WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all group bookings"
  ON public.group_bookings
  FOR ALL
  USING (has_role('admin'));

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_group_memberships_updated_at
    BEFORE UPDATE ON public.group_memberships
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotel_group_deals_updated_at
    BEFORE UPDATE ON public.hotel_group_deals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_bookings_updated_at
    BEFORE UPDATE ON public.group_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
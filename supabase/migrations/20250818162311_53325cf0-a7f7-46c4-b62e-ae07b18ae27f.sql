-- Create table for group leader requests from hotels
CREATE TABLE public.group_leader_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  affinity TEXT NOT NULL,
  requested_dates TEXT NOT NULL,
  rooms_requested INTEGER NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.group_leader_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Hotel owners can create their own requests" 
ON public.group_leader_requests 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = group_leader_requests.hotel_id 
    AND hotels.owner_id = auth.uid()
  )
);

CREATE POLICY "Hotel owners can view their own requests" 
ON public.group_leader_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = group_leader_requests.hotel_id 
    AND hotels.owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all requests" 
ON public.group_leader_requests 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all requests" 
ON public.group_leader_requests 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_group_leader_requests_updated_at
BEFORE UPDATE ON public.group_leader_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create group proposals table
CREATE TABLE public.group_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  leader_id UUID NOT NULL,
  group_topic TEXT NOT NULL,
  proposed_hotel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.group_proposals ENABLE ROW LEVEL SECURITY;

-- Create policies for group proposals
CREATE POLICY "Leaders can view their own proposals" 
ON public.group_proposals 
FOR SELECT 
USING (auth.uid() = leader_id);

CREATE POLICY "Leaders can create their own proposals" 
ON public.group_proposals 
FOR INSERT 
WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Admins can view all proposals" 
ON public.group_proposals 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update proposals" 
ON public.group_proposals 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_group_proposals_updated_at
BEFORE UPDATE ON public.group_proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
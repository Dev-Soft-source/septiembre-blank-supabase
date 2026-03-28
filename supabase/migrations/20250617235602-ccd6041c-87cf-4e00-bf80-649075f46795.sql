
-- Create admin_messages table for hotel communications
CREATE TABLE public.admin_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  hotel_id UUID REFERENCES public.hotels(id),
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (assuming admin users table exists)
CREATE POLICY "Admin users can view all messages" 
  ON public.admin_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid()
    )
  );

-- Create policy for authenticated users to insert their own messages
CREATE POLICY "Users can create messages" 
  ON public.admin_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_admin_messages_updated_at 
  BEFORE UPDATE ON public.admin_messages 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

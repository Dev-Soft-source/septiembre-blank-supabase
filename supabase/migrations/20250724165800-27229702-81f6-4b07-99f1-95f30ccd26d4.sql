-- Create admin logs table for security audit
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin logs
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin logs
CREATE POLICY "Only admins can view admin logs" 
ON public.admin_logs 
FOR SELECT 
USING (public.is_admin_user());

-- System can insert admin logs
CREATE POLICY "System can insert admin logs" 
ON public.admin_logs 
FOR INSERT 
WITH CHECK (true);
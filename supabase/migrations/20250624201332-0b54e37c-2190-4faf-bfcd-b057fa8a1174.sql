
-- Create table for tracking API usage to enforce rate limits
CREATE TABLE IF NOT EXISTS public.api_usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  hour_key TEXT NOT NULL,
  requests_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(service, hour_key)
);

-- Enable RLS
ALTER TABLE public.api_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Admin can manage API usage tracking" 
  ON public.api_usage_tracking 
  FOR ALL 
  USING (public.is_admin_user());

-- Add index for efficient queries
CREATE INDEX IF NOT EXISTS idx_api_usage_service_hour ON public.api_usage_tracking(service, hour_key);

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER update_api_usage_tracking_updated_at
    BEFORE UPDATE ON public.api_usage_tracking
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

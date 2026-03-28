
-- Create a table to track notification delivery status
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL,
    notification_type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add an index for faster lookups by submission_id
CREATE INDEX IF NOT EXISTS idx_notification_logs_submission_id ON public.notification_logs(submission_id);

-- Grant access to authenticated users (you might want to restrict this further based on your needs)
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Only allow service role and authenticated users to read notification logs
CREATE POLICY "Allow service role to manage notification logs" 
ON public.notification_logs 
FOR ALL
TO service_role
USING (true);

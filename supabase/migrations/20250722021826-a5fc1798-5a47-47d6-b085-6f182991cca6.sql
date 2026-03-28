
-- Create temporary table to store raw JotForm submissions for debugging
CREATE TABLE public.jotform_raw (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    headers JSONB NOT NULL,
    content_type TEXT NOT NULL,
    raw_body TEXT NOT NULL,
    parsed_data JSONB,
    parse_method TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.jotform_raw ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to raw data
CREATE POLICY "Admin users can manage raw jotform data" 
ON public.jotform_raw 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create index for efficient querying
CREATE INDEX idx_jotform_raw_received_at ON public.jotform_raw(received_at);

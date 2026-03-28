-- Extend filters table for JotForm integration
ALTER TABLE public.filters 
ADD COLUMN jotform_field_id TEXT,
ADD COLUMN source_type TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN last_sync_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Add check constraint for source_type
ALTER TABLE public.filters 
ADD CONSTRAINT filters_source_type_check 
CHECK (source_type IN ('manual', 'jotform'));

-- Create index for efficient queries
CREATE INDEX idx_filters_source_type ON public.filters(source_type);
CREATE INDEX idx_filters_category_active ON public.filters(category, is_active);
CREATE INDEX idx_filters_jotform_field_id ON public.filters(jotform_field_id) WHERE jotform_field_id IS NOT NULL;

-- Create sync_logs table to track JotForm synchronization operations
CREATE TABLE public.jotform_sync_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sync_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    sync_completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'running',
    items_processed INTEGER DEFAULT 0,
    items_added INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    items_deactivated INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sync_logs
ALTER TABLE public.jotform_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to sync logs
CREATE POLICY "Admin users can manage sync logs" 
ON public.jotform_sync_logs 
FOR ALL 
USING (is_admin(auth.uid()));
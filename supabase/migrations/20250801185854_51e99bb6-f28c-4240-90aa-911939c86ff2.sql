-- Trigger batch translation for all existing hotels that lack translations
-- This will populate hotel_translations table for existing badge-created hotels

-- Create a trigger function to call the batch-translate-hotels edge function
CREATE OR REPLACE FUNCTION trigger_batch_hotel_translations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Call the edge function to batch translate hotels
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/batch-translate-hotels',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"}'::jsonb,
      body := json_build_object(
        'languages', ARRAY['es', 'pt', 'ro']
      )::jsonb
    );
    
  RAISE LOG 'Batch hotel translation triggered successfully';
END;
$$;

-- Execute the batch translation for existing hotels
SELECT trigger_batch_hotel_translations();
-- Remove specified columns from hotels table
-- Surgical removal of unused/obsolete columns

-- Drop the specified columns from hotels table
ALTER TABLE public.hotels DROP COLUMN IF EXISTS room_types;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS version;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS is_locked;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS admin_notes;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS audit_trail;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS additional_data;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS pending_flags;

-- Add comment to document the cleanup
COMMENT ON TABLE public.hotels IS 'Hotels table - removed obsolete columns: room_types, version, is_locked, admin_notes, audit_trail, additional_data, pending_flags';
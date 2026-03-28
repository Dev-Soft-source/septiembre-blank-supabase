-- Add language preference column to profiles table
-- This will store user's preferred language for email communications

-- Check if the column already exists before adding it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'preferred_language'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('es', 'en', 'pt', 'ro'));
        
        -- Add comment to document the column
        COMMENT ON COLUMN public.profiles.preferred_language IS 'User preferred language for email communications: Spanish (es), English (en), Portuguese (pt), Romanian (ro)';
        
        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS idx_profiles_preferred_language ON public.profiles(preferred_language);
    END IF;
END $$;
-- Remove default value from role field and make it nullable
ALTER TABLE public.profiles 
ALTER COLUMN role DROP DEFAULT,
ALTER COLUMN role DROP NOT NULL;
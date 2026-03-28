
-- Fix the RLS policy to avoid accessing auth.users table
-- This removes the problematic email check that requires access to auth.users
DROP POLICY IF EXISTS "Allow association registration" ON public.hotel_associations;

CREATE POLICY "Allow association registration" 
ON public.hotel_associations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

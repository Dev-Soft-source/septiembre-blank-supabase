-- CRITICAL SECURITY FIX #1: Fix join_us_files RLS policies
-- Remove overly permissive policies that allow anyone to access user files

DROP POLICY IF EXISTS "Allow anyone to select join us file records" ON public.join_us_files;
DROP POLICY IF EXISTS "Allow anyone to delete join us file records" ON public.join_us_files;
DROP POLICY IF EXISTS "Allow anyone to insert join us file records" ON public.join_us_files;

-- Create secure policies based on actual table structure
-- Since this table stores uploaded files, restrict access to admins only for sensitive data
CREATE POLICY "Only administrators can view file records" 
ON public.join_us_files 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Only administrators can delete file records" 
ON public.join_us_files 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
);

-- Allow file uploads but restrict to necessary operations only
CREATE POLICY "Allow system file uploads" 
ON public.join_us_files 
FOR INSERT 
WITH CHECK (true); -- This may need to be restricted based on business requirements
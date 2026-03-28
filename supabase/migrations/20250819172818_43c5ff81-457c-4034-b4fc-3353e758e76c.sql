-- CRITICAL SECURITY FIX #1: Fix join_us_files RLS policies
-- Remove overly permissive policies that allow anyone to access user files

DROP POLICY IF EXISTS "Allow anyone to select join us file records" ON public.join_us_files;
DROP POLICY IF EXISTS "Allow anyone to delete join us file records" ON public.join_us_files;
DROP POLICY IF EXISTS "Allow anyone to insert join us file records" ON public.join_us_files;

-- Create secure policies that only allow file owners and admins to access files
CREATE POLICY "Users can view their own files" 
ON public.join_us_files 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own files" 
ON public.join_us_files 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
);

-- Keep anonymous insert for file uploads but ensure user_id is properly set
CREATE POLICY "Allow authenticated file uploads" 
ON public.join_us_files 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND user_id IS NULL) -- Allow anonymous uploads
);

-- First, let's check if RLS is enabled on hotel_themes table and create proper policies
-- Enable RLS if not already enabled
ALTER TABLE public.hotel_themes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admin users can manage hotel themes" ON public.hotel_themes;
DROP POLICY IF EXISTS "Hotel owners can manage their hotel themes" ON public.hotel_themes;
DROP POLICY IF EXISTS "Public can view hotel themes" ON public.hotel_themes;

-- Create a comprehensive policy for admin users to manage all hotel themes
CREATE POLICY "Admin users can manage hotel themes" 
ON public.hotel_themes 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
  OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create policy for hotel owners to manage their own hotel themes
CREATE POLICY "Hotel owners can manage their hotel themes" 
ON public.hotel_themes 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE id = hotel_themes.hotel_id 
    AND owner_id = auth.uid()
  )
);

-- Create policy for public read access to approved hotel themes
CREATE POLICY "Public can view hotel themes" 
ON public.hotel_themes 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE id = hotel_themes.hotel_id 
    AND status = 'approved'
  )
);

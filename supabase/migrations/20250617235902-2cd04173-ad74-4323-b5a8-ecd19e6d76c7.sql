
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Admin users can view all messages" ON public.admin_messages;

-- Create a simpler policy that checks if user is admin using the existing is_admin function
CREATE POLICY "Admin users can view all messages" 
  ON public.admin_messages 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Also add policies for admin users to manage messages
CREATE POLICY "Admin users can update messages" 
  ON public.admin_messages 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete messages" 
  ON public.admin_messages 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

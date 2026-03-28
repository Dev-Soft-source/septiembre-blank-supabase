
-- First, let's check what policies exist on the payments table and fix them
-- Drop any problematic policies on payments table
DROP POLICY IF EXISTS "Admin users can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Admin users can manage payments" ON public.payments;

-- Enable RLS on payments table if not already enabled
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create proper policies for payments table using the is_admin function
CREATE POLICY "Admin users can view all payments" 
  ON public.payments 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update payments" 
  ON public.payments 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete payments" 
  ON public.payments 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can insert payments" 
  ON public.payments 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

-- Also create a policy for users to view their own payments
CREATE POLICY "Users can view their own payments" 
  ON public.payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

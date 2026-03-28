-- Secure the new table created in the previous migration
ALTER TABLE IF EXISTS public.price_caps ENABLE ROW LEVEL SECURITY;

-- Public read access (non-sensitive reference data)
DROP POLICY IF EXISTS "Public can view price caps" ON public.price_caps;
CREATE POLICY "Public can view price caps"
ON public.price_caps
FOR SELECT
USING (true);

-- Admins can manage caps
DROP POLICY IF EXISTS "Admins can manage price caps" ON public.price_caps;
CREATE POLICY "Admins can manage price caps"
ON public.price_caps
FOR ALL
USING (is_admin_user())
WITH CHECK (is_admin_user());
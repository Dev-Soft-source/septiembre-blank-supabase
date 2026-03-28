-- Create idempotency storage table per API v2 spec
-- This migration is additive and non-destructive

-- 1) Idempotency table
CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  key TEXT NOT NULL,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  body_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | completed | failed
  response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
  UNIQUE (user_id, key)
);

-- Enable RLS
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Policies (owner-only access)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'idempotency_keys' AND policyname = 'Users can manage own idempotency keys'
  ) THEN
    CREATE POLICY "Users can manage own idempotency keys"
    ON public.idempotency_keys
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END$$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_user_key ON public.idempotency_keys(user_id, key);
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires_at ON public.idempotency_keys(expires_at);

-- Optional: small helper to garbage-collect expired keys (can be scheduled via pg_cron later)
CREATE OR REPLACE FUNCTION public.cleanup_expired_idempotency_keys()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM public.idempotency_keys WHERE expires_at < now();
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;
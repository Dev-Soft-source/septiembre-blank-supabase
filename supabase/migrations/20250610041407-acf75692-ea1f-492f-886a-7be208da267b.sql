
-- Enable Row Level Security on the join_us_submissions table
-- This is required because policies exist but RLS is not enabled
ALTER TABLE public.join_us_submissions ENABLE ROW LEVEL SECURITY;

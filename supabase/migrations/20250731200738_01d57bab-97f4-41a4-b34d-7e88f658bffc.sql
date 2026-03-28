-- Add referral_code field to hotel_associations table
ALTER TABLE public.hotel_associations 
ADD COLUMN referral_code TEXT DEFAULT ('1' || LPAD(FLOOR(RANDOM()*99999)::text, 5, '0') || CHR(FLOOR(RANDOM()*26)::int + 65));

-- Add referral_code field to agents table  
ALTER TABLE public.agents
ADD COLUMN referral_code TEXT DEFAULT ('2' || LPAD(FLOOR(RANDOM()*99999)::text, 5, '0') || CHR(FLOOR(RANDOM()*26)::int + 65));

-- Add referral_code field to profiles table for hotels
ALTER TABLE public.profiles
ADD COLUMN referral_code TEXT DEFAULT ('3' || LPAD(FLOOR(RANDOM()*99999)::text, 5, '0') || CHR(FLOOR(RANDOM()*26)::int + 65));
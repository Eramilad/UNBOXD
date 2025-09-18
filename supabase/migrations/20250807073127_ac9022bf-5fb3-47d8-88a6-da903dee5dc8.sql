
-- Add referral_code column to service_requests table
ALTER TABLE public.service_requests 
ADD COLUMN referral_code TEXT;

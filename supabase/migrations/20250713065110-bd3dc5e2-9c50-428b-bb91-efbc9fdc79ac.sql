
-- Add move_option column to service_requests table if it doesn't already exist
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS move_option TEXT;

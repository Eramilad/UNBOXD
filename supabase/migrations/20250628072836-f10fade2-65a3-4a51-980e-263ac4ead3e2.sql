
-- Enable RLS on service_requests table if not already enabled
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert service requests (public form)
CREATE POLICY "Allow public insert on service_requests"
ON public.service_requests
FOR INSERT
TO public
WITH CHECK (true);

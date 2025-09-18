-- Drop the overly permissive policy that allows public access to provider details
DROP POLICY IF EXISTS "Anyone can view provider profiles for booking" ON public.providers;

-- Create a new policy that requires authentication to view provider profiles
CREATE POLICY "Authenticated users can view verified provider profiles for booking"
ON public.providers
FOR SELECT
TO authenticated
USING (is_verified = true);
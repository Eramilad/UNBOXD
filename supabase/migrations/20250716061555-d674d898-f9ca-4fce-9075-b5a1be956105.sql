-- Create the update function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create providers table for service provider authentication
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  services TEXT[],
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- Create policies for provider access
CREATE POLICY "Providers can view their own profile" 
ON public.providers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Providers can update their own profile" 
ON public.providers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view provider profiles for booking" 
ON public.providers 
FOR SELECT 
USING (is_verified = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_providers_updated_at
BEFORE UPDATE ON public.providers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
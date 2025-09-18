
-- Create enum types for various job and worker statuses
CREATE TYPE job_status AS ENUM ('open', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE job_size AS ENUM ('light', 'medium', 'heavy');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'paid', 'failed');
CREATE TYPE worker_status AS ENUM ('available', 'busy', 'paused', 'offline');
CREATE TYPE badge_type AS ENUM ('5_star_pro', 'mover_of_month', 'certified_packing', 'speed_demon', 'customer_favorite');

-- Workers/Service Providers table
CREATE TABLE public.workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  location TEXT,
  skills TEXT[],
  status worker_status DEFAULT 'available',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_jobs INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  availability_schedule JSONB, -- Store weekly schedule
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id),
  worker_id UUID REFERENCES public.workers(id),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  destination TEXT,
  job_size job_size NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  status job_status DEFAULT 'open',
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  customer_review TEXT,
  worker_rating INTEGER CHECK (worker_rating >= 1 AND worker_rating <= 5),
  worker_review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Worker badges table
CREATE TABLE public.worker_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(worker_id, badge_type)
);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Training modules table
CREATE TABLE public.training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_url TEXT, -- Video/audio/PDF URL
  duration_minutes INTEGER,
  badge_reward badge_type,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Worker training progress table
CREATE TABLE public.worker_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0,
  UNIQUE(worker_id, module_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workers
CREATE POLICY "Workers can view their own profile" ON public.workers
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Workers can update their own profile" ON public.workers
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can view worker profiles" ON public.workers
FOR SELECT USING (true);

CREATE POLICY "Users can create worker profiles" ON public.workers
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for jobs
CREATE POLICY "Users can view jobs they're involved in" ON public.jobs
FOR SELECT USING (customer_id = auth.uid() OR worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid()));

CREATE POLICY "Customers can create jobs" ON public.jobs
FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Workers and customers can update their jobs" ON public.jobs
FOR UPDATE USING (customer_id = auth.uid() OR worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid()));

-- RLS Policies for payments
CREATE POLICY "Workers can view their payments" ON public.payments
FOR SELECT USING (worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for training
CREATE POLICY "Anyone can view training modules" ON public.training_modules
FOR SELECT USING (true);

CREATE POLICY "Workers can view their training progress" ON public.worker_training_progress
FOR SELECT USING (worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid()));

CREATE POLICY "Workers can update their training progress" ON public.worker_training_progress
FOR ALL USING (worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid()));

-- RLS Policies for badges
CREATE POLICY "Anyone can view worker badges" ON public.worker_badges
FOR SELECT USING (true);

CREATE POLICY "System can insert badges" ON public.worker_badges
FOR INSERT WITH CHECK (true);

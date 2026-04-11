-- 1. Upgrade the user role check constraint to allow 'admin'
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('buyer', 'seller', 'both', 'admin'));

-- 2. Grant admins global access to Maintenance Requests
CREATE POLICY "Admins can view and manage all maintenance requests" 
ON public.maintenance_requests 
FOR ALL 
USING ( 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ) 
);

-- 3. Grant admins global access to Users profiles
CREATE POLICY "Admins can manage all users" 
ON public.users 
FOR ALL 
USING ( 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ) 
);

-- 4. Grant admins global access to all Listings
CREATE POLICY "Admins can moderate all listings" 
ON public.listings 
FOR ALL 
USING ( 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ) 
);

-- Note: Run this in your Supabase SQL Editor. 
-- Afterwards, to make yourself an admin, run:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';

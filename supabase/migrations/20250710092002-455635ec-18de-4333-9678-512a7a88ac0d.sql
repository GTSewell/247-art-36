-- Temporarily disable RLS on products table for debugging
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- We'll re-enable it after fixing the admin assignment issue
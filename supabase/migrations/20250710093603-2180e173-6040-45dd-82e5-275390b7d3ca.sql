-- Re-enable RLS on products table with proper policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create updated policies for products table
-- 1. Public read access for store functionality
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- 2. Artists can view their assigned products
CREATE POLICY "Artists can view their assigned products" 
ON public.products 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  artist_id IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM artists 
    WHERE artists.id = products.artist_id 
    AND artists.user_id = auth.uid()
  )
);

-- 3. Admin management access
CREATE POLICY "Admins can manage all products" 
ON public.products 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());
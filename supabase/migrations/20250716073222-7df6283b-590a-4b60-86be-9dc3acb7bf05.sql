-- Add is_visible field to products table for admin visibility control
ALTER TABLE public.products 
ADD COLUMN is_visible BOOLEAN DEFAULT true;

-- Add comment for clarity
COMMENT ON COLUMN public.products.is_visible IS 'Controls whether the product is visible to customers in the store';
-- Add category_source field to track how categories were assigned
ALTER TABLE public.products 
ADD COLUMN category_source text DEFAULT 'auto' CHECK (category_source IN ('manual', 'shopify', 'auto'));

-- Update existing products to have 'auto' source for those with shopify_product_id
UPDATE public.products 
SET category_source = 'shopify' 
WHERE shopify_product_id IS NOT NULL;

-- Add index for performance
CREATE INDEX idx_products_category_source ON public.products(category_source);
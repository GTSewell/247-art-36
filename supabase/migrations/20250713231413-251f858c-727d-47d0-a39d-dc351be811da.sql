-- Add new fields for enhanced product information
ALTER TABLE public.products 
ADD COLUMN additional_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN specifications JSONB DEFAULT '{}'::jsonb,
ADD COLUMN production_info TEXT,
ADD COLUMN shipping_info TEXT,
ADD COLUMN custom_description TEXT,
ADD COLUMN hero_image_url TEXT;

-- Create an index for better performance on additional_images
CREATE INDEX idx_products_additional_images ON public.products USING GIN(additional_images);

-- Create an index for better performance on specifications  
CREATE INDEX idx_products_specifications ON public.products USING GIN(specifications);
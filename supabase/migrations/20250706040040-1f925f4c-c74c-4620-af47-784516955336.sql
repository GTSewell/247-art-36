-- Add Shopify integration fields to existing products table
ALTER TABLE public.products 
ADD COLUMN shopify_product_id TEXT,
ADD COLUMN shopify_variant_id TEXT,
ADD COLUMN shopify_inventory_quantity INTEGER DEFAULT 0,
ADD COLUMN shopify_handle TEXT,
ADD COLUMN shopify_tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;

-- Create unique index on shopify_product_id for efficient lookups
CREATE UNIQUE INDEX idx_products_shopify_id ON public.products(shopify_product_id) WHERE shopify_product_id IS NOT NULL;

-- Create shopify_sync_log table for tracking sync operations
CREATE TABLE public.shopify_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('products', 'inventory', 'orders')),
  products_synced INTEGER NOT NULL DEFAULT 0,
  products_failed INTEGER NOT NULL DEFAULT 0,
  sync_details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on shopify_sync_log
ALTER TABLE public.shopify_sync_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view sync logs
CREATE POLICY "Only admins can view sync logs" ON public.shopify_sync_log
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    )
  );
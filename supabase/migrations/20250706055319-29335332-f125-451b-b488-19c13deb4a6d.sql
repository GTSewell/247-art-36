-- Add unique constraint to shopify_product_id to prevent duplicate products
ALTER TABLE products ADD CONSTRAINT unique_shopify_product_id UNIQUE (shopify_product_id);
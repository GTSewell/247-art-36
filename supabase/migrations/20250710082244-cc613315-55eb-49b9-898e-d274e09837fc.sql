-- Add new values to the product_category enum
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'original';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'signed'; 
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'collection';
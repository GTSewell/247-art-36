-- Clean up demo data: Remove demo artists and non-Shopify products

-- First, remove all products that are NOT synced from Shopify (no shopify_product_id)
DELETE FROM products WHERE shopify_product_id IS NULL;

-- Remove demo artists (IDs 1-23 are unpublished demo artists)
-- Also remove the "Demo Artist" at ID 25
DELETE FROM artists WHERE id BETWEEN 1 AND 23 OR name = 'Demo Artist';

-- Clean up any orphaned favorite_artists records
DELETE FROM favorite_artists WHERE artist_id NOT IN (SELECT id FROM artists);

-- Reset the artists sequence to start after the remaining artists
SELECT setval('artists_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM artists));

-- Reset the products sequence to start after the remaining products  
SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM products));
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface AssignedProduct {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  description: string | null;
  shopify_handle: string | null;
  specifications?: Record<string, string>;
}

export const useAssignedProducts = (artistId: number | null) => {
  const [products, setProducts] = useState<AssignedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) return;

    const fetchAssignedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        logger.info(`Fetching assigned products for artist ID: ${artistId}`);
        
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('id, name, price, image_url, category, description, shopify_handle, specifications')
          .eq('artist_id', artistId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        logger.info(`Found ${data?.length || 0} assigned products for artist ${artistId}`);
        
        // Transform the data to ensure specifications is properly typed
        const transformedProducts = (data || []).map(product => ({
          ...product,
          specifications: product.specifications as Record<string, string> | undefined
        }));
        
        setProducts(transformedProducts);
        
      } catch (err: any) {
        logger.error('Error fetching assigned products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedProducts();
  }, [artistId]);

  return { products, loading, error };
};
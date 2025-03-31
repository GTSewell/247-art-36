
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  availableForSale: boolean;
  price: string;
  image_url: string;
  artist_id?: number;
  tags: string[];
  variants: Array<{
    id: string;
    title: string;
    price: string;
    availableForSale: boolean;
  }>;
}

interface UseShopifyProductsOptions {
  artistId?: number;
  enabled?: boolean;
}

export const useShopifyProducts = ({ artistId, enabled = true }: UseShopifyProductsOptions = {}) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shopify-products', artistId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('shopify', {
          body: { endpoint: 'products', artistId }
        });

        if (error) {
          logger.error('Error fetching Shopify products:', error);
          toast.error('Failed to load products');
          return [];
        }

        // Transform the Shopify GraphQL response to our desired format
        const transformedProducts = data.data.products.edges.map(({ node }: any) => {
          const price = node.priceRangeV2.minVariantPrice.amount;
          const imageUrl = node.images.edges[0]?.node.url || '';
          
          // Extract artist ID from tags if available
          let artistIdFromTags;
          node.tags.forEach((tag: string) => {
            if (tag.startsWith('artist-')) {
              artistIdFromTags = parseInt(tag.replace('artist-', ''), 10);
            }
          });

          return {
            id: node.id,
            title: node.title,
            description: node.description,
            handle: node.handle,
            availableForSale: node.availableForSale,
            price,
            image_url: imageUrl,
            artist_id: artistIdFromTags,
            tags: node.tags,
            variants: node.variants.edges.map(({ node: variant }: any) => ({
              id: variant.id,
              title: variant.title,
              price: variant.price,
              availableForSale: variant.availableForSale
            }))
          };
        });

        return transformedProducts;
      } catch (err) {
        logger.error('Error in useShopifyProducts:', err);
        toast.error('Failed to load products');
        return [];
      }
    },
    enabled
  });

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  return {
    products,
    isLoading,
    error,
    refetch
  };
};

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import type { ShopifySyncLog, ProductWithShopify } from '@/types/shopify';

export const useShopifyIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync products from Shopify to local database
  const syncProducts = useCallback(async (autoActivate = false) => {
    setIsSyncing(true);
    try {
      logger.info('Starting Shopify product sync...');
      
      const { data, error } = await supabase.functions.invoke('sync-shopify-products', {
        body: { autoActivate }
      });
      
      if (error) {
        throw error;
      }

      const result = data as { success: boolean; synced: number; failed: number; results: any[] };
      
      if (result.success) {
        toast.success(`Synced ${result.synced} products successfully!`, {
          description: result.failed > 0 ? `${result.failed} products failed to sync` : undefined
        });
        logger.info(`Shopify sync completed: ${result.synced} synced, ${result.failed} failed`);
        return result;
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      logger.error('Shopify sync error:', error);
      toast.error('Failed to sync products from Shopify');
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Get product details from Shopify
  const getProductDetails = useCallback(async (productId?: string, handle?: string) => {
    if (!productId && !handle) {
      throw new Error('Either productId or handle is required');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-shopify-product-details', {
        body: { productId, handle }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting Shopify product details:', error);
      toast.error('Failed to get product details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get sync logs for admin users
  const getSyncLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('shopify_sync_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error fetching sync logs:', error);
      return [];
    }
  }, []);

  // Get products with Shopify data
  const getShopifyProducts = useCallback(async (category?: 'print' | 'merch' | 'sticker') => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          artists (
            id,
            name,
            image
          )
        `)
        .not('shopify_product_id', 'is', null);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match ProductWithShopify interface with proper artist name
      const products = data?.map(product => ({
        ...product,
        status: 'active' as const,
        artist_name: product.artists?.name || 'Unassigned'
      })) || [];

      logger.info('Fetched Shopify products:', { 
        count: products.length, 
        categoryFilter: category,
        sampleProduct: products[0] ? {
          id: products[0].id,
          name: products[0].name,
          category: products[0].category,
          artist_id: products[0].artist_id,
          artist_name: products[0].artist_name
        } : null
      });

      return products;
    } catch (error) {
      logger.error('Error fetching Shopify products:', error);
      return [];
    }
  }, []);

  return {
    isLoading,
    isSyncing,
    syncProducts,
    getProductDetails,
    getSyncLogs,
    getShopifyProducts
  };
};
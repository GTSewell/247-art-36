
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import { v4 as uuidv4 } from "@/utils/uuid";
import { useState } from "react";
import { useShopifyIntegration } from "@/hooks/useShopifyIntegration";

export const usePWAStoreProducts = () => {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const { getVisibleShopifyProducts } = useShopifyIntegration();
  
  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        // First try to get visible Shopify-synced products
        const shopifyProducts = await getVisibleShopifyProducts();
        if (shopifyProducts.length > 0) {
          logger.info("Loaded Shopify products:", { count: shopifyProducts.length });
          return shopifyProducts;
        }

        // Fallback to regular products if no Shopify products
        const {
          data,
          error
        } = await supabase.from('products').select('*, artists(name, image)')
          .eq('is_visible', true)
          .order('created_at', {
            ascending: false
          });
        
        if (error) {
          logger.error("Failed to load products from Supabase", error);
          toast.error("Failed to load products");
          return [];
        }
        
        logger.info("Loaded regular products from Supabase:", { count: data?.length || 0 });
        return data || [];
      } catch (error) {
        logger.error("Error loading products:", error);
        toast.error("Failed to load products");
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 60000 // 1 minute
  });

  if (error) {
    logger.error("Query error:", error);
  }

  const generateProductImages = async () => {
    setIsGeneratingImages(true);
    try {
      logger.info("Starting image generation for all product categories");
      toast.info("Generating product images, this may take a minute...");
      
      // Use supabase functions.invoke with correct parameters
      const { data, error } = await supabase.functions.invoke('generate-product-category-images', {
        method: 'POST',
        body: {}
      });

      if (error) {
        logger.error("Error response from generate-product-category-images:", error);
        throw new Error(`Failed to generate product images: ${error.message}`);
      }

      logger.info("Generated product images:", data);
      
      // Force refetch products to get the updated images
      await refetch();
      
      toast.success("Product images generated successfully!");
      return data;
    } catch (error) {
      logger.error("Error generating product images:", error);
      toast.error("Failed to generate product images");
      return null;
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const generateCategoryImage = async (category: string) => {
    try {
      logger.info(`Generating image for specific category: ${category}`);
      
      const { data, error } = await supabase.functions.invoke('generate-product-category-images', {
        method: 'POST',
        body: { category, single: true }
      });

      if (error) {
        throw new Error(`Failed to generate image for ${category}: ${error.message}`);
      }

      logger.info(`Generated image for ${category}:`, data);
      
      // Refetch products to get the updated images
      await refetch();
      
      return data.imageUrl;
    } catch (error) {
      logger.error(`Error generating image for ${category}:`, error);
      toast.error(`Failed to generate image for ${category}`);
      return null;
    }
  };

  const getProductsForCategory = (categoryId: string) => {
    const categoryProducts = products?.filter(p => p.category === categoryId) || [];
    logger.info(`🏪 Getting products for category ${categoryId}:`, { 
      count: categoryProducts.length,
      allCategories: [...new Set(products?.map(p => p.category) || [])],
      totalProducts: products?.length || 0,
      sampleProducts: categoryProducts.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        artist_name: (p as any).artist_name || p.artists?.name
      }))
    });
    return categoryProducts;
  };

  const featuredProducts = products?.filter(p => p.is_featured) || [];

  return {
    products,
    featuredProducts,
    getProductsForCategory,
    generateProductImages,
    generateCategoryImage,
    isLoading,
    error,
    refetch,
    isGeneratingImages
  };
};

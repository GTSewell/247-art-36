
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import { v4 as uuidv4 } from "@/utils/uuid";
import { useState } from "react";

export const usePWAStoreProducts = () => {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  
  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('products').select('*, artists(name, image)').order('created_at', {
          ascending: false
        });
        
        if (error) {
          logger.error("Failed to load products from Supabase", error);
          toast.error("Failed to load products");
          return [];
        }
        
        logger.info("Loaded products from Supabase:", { count: data?.length || 0 });
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
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-product-category-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error("Error response from generate-product-category-images:", errorData);
        throw new Error(`Failed to generate product images: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      logger.info("Generated product images:", result);
      
      // Force refetch products to get the updated images
      await refetch();
      
      toast.success("Product images generated successfully!");
      return result;
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
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-product-category-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ category, single: true })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image for ${category}`);
      }

      const result = await response.json();
      logger.info(`Generated image for ${category}:`, result);
      
      // Refetch products to get the updated images
      await refetch();
      
      return result.imageUrl;
    } catch (error) {
      logger.error(`Error generating image for ${category}:`, error);
      toast.error(`Failed to generate image for ${category}`);
      return null;
    }
  };

  const getProductsForCategory = (categoryId: string) => {
    const categoryProducts = products?.filter(p => p.category === categoryId) || [];
    
    if (categoryProducts.length === 0 && !isLoading) {
      const sampleProducts = [];
      const categoryNames = {
        'original': 'Original Artwork',
        'signed': 'Signed Print',
        'sticker': 'Sticker',
        'merch': 'T-Shirt',
        'print': 'Art Print',
        'collection': '247 Collection'
      };
      
      // Unique timestamp for cache busting
      const timestamp = Date.now();
      
      for (let i = 1; i <= 6; i++) {
        const productId = `sample-${categoryId}-${i}`;
        const isLimitedEdition = i % 2 === 0;
        
        sampleProducts.push({
          id: productId,
          name: `${categoryNames[categoryId as keyof typeof categoryNames]} ${i}`,
          price: (Math.random() * 100 + 20).toFixed(2),
          category: categoryId,
          image_url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${categoryId}/${categoryId}-${i}-${uuidv4()}.webp?t=${timestamp}`,
          is_limited_edition: isLimitedEdition,
          artists: { name: 'Demo Artist' }
        });
      }
      
      logger.info(`Generated ${sampleProducts.length} sample products for category ${categoryId}`);
      return sampleProducts;
    }
    
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

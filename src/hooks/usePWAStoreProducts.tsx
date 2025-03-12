
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

export const usePWAStoreProducts = () => {
  const {
    data: products,
    isLoading,
    error
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
        return data || [];
      } catch (error) {
        logger.error("Error loading products:", error);
        toast.error("Failed to load products");
        return [];
      }
    }
  });

  if (error) {
    logger.error("Query error:", error);
  }

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
      
      for (let i = 1; i <= 6; i++) {
        sampleProducts.push({
          id: `sample-${categoryId}-${i}`,
          name: `${categoryNames[categoryId as keyof typeof categoryNames]} ${i}`,
          price: (Math.random() * 100 + 20).toFixed(2),
          category: categoryId,
          image_url: i % 3 === 0 ? '/placeholder.svg' : 
                    categoryId === 'print' ? 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=1000&auto=format&fit=crop' : 
                    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
          is_limited_edition: i % 2 === 0,
          artists: { name: 'Demo Artist' }
        });
      }
      
      return sampleProducts;
    }
    
    return categoryProducts;
  };

  const featuredProducts = products?.filter(p => p.is_featured) || [];

  return {
    products,
    featuredProducts,
    getProductsForCategory,
    isLoading,
    error
  };
};

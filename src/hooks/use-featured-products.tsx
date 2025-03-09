
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

export function useFeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        logger.info("Fetching featured products");

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) {
          logger.error("Error fetching products:", error);
          setError("Failed to load products");
          throw error;
        }

        logger.info(`Fetched ${data?.length || 0} products`);
        setProducts(data || []);
      } catch (err) {
        logger.error("Error in fetchProducts:", err);
        setError("An error occurred while loading products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}


import React, { useState, useEffect } from "react";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import TimedEditionModal from "@/components/store/TimedEditionModal";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { useAppMode } from "@/contexts/AppModeContext";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

interface PWATimedEditionsProps {
  isLoading: boolean;
}

const PWATimedEditions: React.FC<PWATimedEditionsProps> = ({ isLoading }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isPWA } = useAppMode();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelect = (product: any, timer: TimerState) => {
    logger.info(`Selected product: ${product.id}, timer: ${JSON.stringify(timer)}`);
    setSelectedProduct(product);
    setTimerState(timer);
  };

  return (
    <>
      <div className="w-full timed-editions-carousel">
        <div className="flex justify-center mb-1">
          <img 
            src="/lovable-uploads/24a9187e-656c-4725-8828-f68864f96228.png" 
            alt="Timed Editions" 
            className="h-14 object-contain"
          />
        </div>

        {!isLoading && products.length > 0 ? (
          <div className="overflow-hidden w-full pb-12">
            <FeaturedProducts
              products={products}
              onProductSelect={handleProductSelect}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-24">
            <p className="text-lg">
              {isLoading ? "Loading products..." : "No products found"}
            </p>
          </div>
        )}
      </div>

      {/* Timed Edition Modal */}
      <TimedEditionModal
        isOpen={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setTimerState(null);
        }}
        product={selectedProduct}
        timeLeft={timerState || { hours: 0, minutes: 0, seconds: 0 }}
      />
    </>
  );
};

export default PWATimedEditions;

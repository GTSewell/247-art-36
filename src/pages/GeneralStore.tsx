
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/navigation/Navigation";
import { toast } from "sonner";
import TimedEditionModal from "@/components/store/TimedEditionModal";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import FilteredProducts from "@/components/store/FilteredProducts";
import { TimerProvider } from "@/contexts/TimerContext";
import { logger } from "@/utils/logger";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

const GeneralStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<'print' | 'merch' | 'sticker'>('print');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTimerState, setSelectedTimerState] = useState<TimerState | null>(null);
  
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

  const featuredProducts = products?.filter(p => p.is_featured) || [];
  const filteredProducts = products?.filter(p => p.category === selectedCategory).slice(0, 16) || [];

  const handleProductSelect = (product: any, timerState: TimerState) => {
    setSelectedProduct(product);
    setSelectedTimerState(timerState);
  };

  return (
    <TimerProvider>
      <div className="min-h-screen bg-zap-red">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <FeaturedProducts 
            products={featuredProducts}
            onProductSelect={handleProductSelect}
          />

          <TimedEditionModal
            isOpen={!!selectedProduct}
            onClose={() => {
              setSelectedProduct(null);
              setSelectedTimerState(null);
            }}
            product={selectedProduct}
            timeLeft={selectedTimerState || { hours: 0, minutes: 0, seconds: 0 }}
          />

          <FilteredProducts
            products={filteredProducts}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-zap-blue">Loading products...</div>
            </div>
          )}
        </main>
      </div>
    </TimerProvider>
  );
};

export default GeneralStore;

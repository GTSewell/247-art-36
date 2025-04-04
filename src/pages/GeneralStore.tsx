
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/navigation/Navigation";
import { toast } from "sonner";
import TimedEditionModal from "@/components/store/TimedEditionModal";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import FilteredProducts from "@/components/store/FilteredProducts";
import { TimerProvider } from "@/contexts/TimerContext";
import { logger } from "@/utils/logger";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ThemeToggle from "@/components/ThemeToggle";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

const GeneralStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<'print' | 'merch' | 'sticker'>('print');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTimerState, setSelectedTimerState] = useState<TimerState | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  
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

  const handleThemeToggle = (isDark: boolean) => {
    setDarkMode(isDark);
  };

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
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
          <Navigation />
          <main className="container mx-auto px-4 pt-24 pb-12">
            <div className="flex justify-end mb-4">
              <ThemeToggle localOnly={true} onToggle={handleThemeToggle} />
            </div>
            
            <Alert className="mb-6 bg-zap-yellow border-zap-yellow text-black">
              <AlertDescription className="text-lg font-bold">
                This is a mock-up Storefront page, purely for demonstration purposes. It will display ALL artists original artworks, merch & fine art prints & limited timed edition drops etc. Each artist will have their artworks & prints available on your very own ATLAS 'Link in Bio' profile.
              </AlertDescription>
            </Alert>
            
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
                <div className="animate-pulse text-zap-blue dark:text-zap-blue">Loading products...</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </TimerProvider>
  );
};

export default GeneralStore;

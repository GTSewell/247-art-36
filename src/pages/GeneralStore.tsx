import { useState, useEffect } from "react";
import Navigation from "@/components/navigation/Navigation";
import { toast } from "sonner";
import TimedEditionModal from "@/components/store/TimedEditionModal";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import StoreAccordion from "@/components/store/StoreAccordion";
import { TimerProvider } from "@/contexts/TimerContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePWAStoreProducts } from "@/hooks/usePWAStoreProducts";
import { logger } from "@/utils/logger";
interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}
const GeneralStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTimerState, setSelectedTimerState] = useState<TimerState | null>(null);
  const {
    featuredProducts,
    getProductsForCategory,
    isLoading,
    isGeneratingImages
  } = usePWAStoreProducts();
  useEffect(() => {
    logger.info(`Category changed to: ${selectedCategory}`);
  }, [selectedCategory]);
  const filteredProducts = getProductsForCategory(selectedCategory);
  const handleProductSelect = (product: any, timerState: TimerState) => {
    setSelectedProduct(product);
    setSelectedTimerState(timerState);
  };
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  return <TimerProvider>
      <div className="min-h-screen transition-colors duration-200">
        <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
          <Navigation />
          
          <main className="container mx-auto px-4 pt-24 pb-20 py-[25px]">
            <div className="w-full">
              {/* <FeaturedProducts products={featuredProducts} onProductSelect={handleProductSelect} /> */}

              <TimedEditionModal isOpen={!!selectedProduct} onClose={() => {
              setSelectedProduct(null);
              setSelectedTimerState(null);
            }} product={selectedProduct} timeLeft={selectedTimerState || {
              hours: 0,
              minutes: 0,
              seconds: 0
            }} />

              <StoreAccordion selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} getProductsForCategory={getProductsForCategory} isGeneratingImages={isGeneratingImages} />

              {isLoading && !isGeneratingImages && <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-zap-blue dark:text-zap-blue">
                    Loading products...
                  </div>
                </div>}
            </div>
          </main>
        </div>
      </div>
    </TimerProvider>;
};
export default GeneralStore;
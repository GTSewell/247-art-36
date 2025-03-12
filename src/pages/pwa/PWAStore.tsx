
import React, { useState } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { TimerProvider } from "@/contexts/TimerContext";
import { logger } from "@/utils/logger";
import TimedEditionModal from "@/components/store/TimedEditionModal";
import ProductCategoryView from "@/components/pwa/store/ProductCategoryView";
import StoreHomeView from "@/components/pwa/store/StoreHomeView";
import { usePWAStoreProducts } from "@/hooks/usePWAStoreProducts";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

const PWAStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTimerState, setSelectedTimerState] = useState<TimerState | null>(null);
  const { isPWA } = useAppMode();
  const { featuredProducts, getProductsForCategory, isLoading } = usePWAStoreProducts();
  
  const categoryProducts = selectedCategory ? getProductsForCategory(selectedCategory) : [];

  const handleProductSelect = (product: any, timerState: TimerState) => {
    logger.info(`Selected product: ${product.id}, timer: ${JSON.stringify(timerState)}`);
    setSelectedProduct(product);
    setSelectedTimerState(timerState);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    logger.info(`Selected category: ${category}`);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <TimerProvider>
      <div className="min-h-screen bg-zap-red">
        {isPWA ? <PWANavigation /> : <Navigation />}
        
        <main className={`${isPWA ? 'pt-4 pb-20' : 'container mx-auto px-4 pt-24 pb-20'}`}>
          {selectedCategory ? (
            <ProductCategoryView 
              categoryId={selectedCategory}
              products={categoryProducts}
              onBack={handleBack}
            />
          ) : (
            <StoreHomeView
              featuredProducts={featuredProducts}
              isLoading={isLoading}
              onProductSelect={handleProductSelect}
              onCategorySelect={handleCategorySelect}
            />
          )}
        </main>

        <TimedEditionModal
          isOpen={!!selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setSelectedTimerState(null);
          }}
          product={selectedProduct}
          timeLeft={selectedTimerState || { hours: 0, minutes: 0, seconds: 0 }}
        />
      </div>
    </TimerProvider>
  );
};

export default PWAStore;

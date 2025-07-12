
import React, { useState, useEffect } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { TimerProvider } from "@/contexts/TimerContext";
import { logger } from "@/utils/logger";
import TimedEditionModal from "@/components/store/TimedEditionModal";
import ProductCategoryView from "@/components/pwa/store/ProductCategoryView";
import StoreHomeView from "@/components/pwa/store/StoreHomeView";
import { usePWAStoreProducts } from "@/hooks/usePWAStoreProducts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Helmet } from "react-helmet";
import { GlobalThemeToggle } from "@/components/GlobalThemeToggle";

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
      <Helmet>
        <title>247.ART Store - Buy Original Artworks</title>
        <meta name="description" content="Shop for original artworks, prints and more from independent artists" />
        <meta property="og:title" content="247.ART Store" />
        <meta property="og:description" content="Buy original artworks from independent artists" />
        <meta property="og:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
        <link rel="icon" href="https://247.art/lovable-uploads/15e8cb31-73b1-4d72-9d9b-0dac8bf0baed.png" />
      </Helmet>
      
      <div className="min-h-screen transition-colors duration-200">
        <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
          {isPWA ? <PWANavigation /> : <Navigation />}
          
          <main className={`${isPWA ? 'pt-4 pb-20 w-full' : 'container mx-auto px-4 pt-24 pb-20'}`}>
            {!isPWA && (
              <div className="flex justify-end mb-4">
                <GlobalThemeToggle />
              </div>
            )}
            
            {!selectedCategory && (
              <Alert className="mb-6 bg-zap-yellow border-zap-yellow text-black">
                <AlertDescription className="text-lg font-bold">
                  This is a mock-up Storefront page, and purely for demo display at present. It will display ALL artists original artworks, merch & fine art prints & limited timed edition drops etc. Each artist will have their own artworks available on your personal artist profile.
                </AlertDescription>
              </Alert>
            )}
            
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
      </div>
    </TimerProvider>
  );
};

export default PWAStore;

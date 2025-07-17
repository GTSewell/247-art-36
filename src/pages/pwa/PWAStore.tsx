
import React, { useState, useEffect } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { TimerProvider } from "@/contexts/TimerContext";
import { logger } from "@/utils/logger";
import ProductModal from "@/components/store/ProductModal";
import ProductCategoryView from "@/components/pwa/store/ProductCategoryView";
import StoreHomeView from "@/components/pwa/store/StoreHomeView";
import { usePWAStoreProducts } from "@/hooks/usePWAStoreProducts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Helmet } from "react-helmet";


interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

const PWAStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('merch');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);
  const { isPWA } = useAppMode();
  const { featuredProducts, getProductsForCategory, isLoading } = usePWAStoreProducts();
  
  const categoryProducts = selectedCategory ? getProductsForCategory(selectedCategory) : [];

  const handleProductSelect = (product: any) => {
    logger.info(`Selected product: ${product.id}`);
    setSelectedProduct(product);
    const index = categoryProducts.findIndex(p => p.id === product.id);
    setSelectedProductIndex(Math.max(0, index));
  };

  const handleProductNavigation = (index: number) => {
    if (index >= 0 && index < categoryProducts.length) {
      setSelectedProduct(categoryProducts[index]);
      setSelectedProductIndex(index);
    }
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
              <div className="mb-4">
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
                onProductClick={handleProductSelect}
              />
            ) : (
              <StoreHomeView
                featuredProducts={featuredProducts}
                isLoading={isLoading}
                onProductSelect={(product: any) => handleProductSelect(product)}
                onCategorySelect={handleCategorySelect}
              />
            )}
          </main>

          <ProductModal
            isOpen={!!selectedProduct}
            onClose={() => {
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            products={categoryProducts}
            currentIndex={selectedProductIndex}
            onNavigate={handleProductNavigation}
          />
        </div>
      </div>
    </TimerProvider>
  );
};

export default PWAStore;

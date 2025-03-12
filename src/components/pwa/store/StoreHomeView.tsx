
import React from 'react';
import FeaturedProducts from "@/components/store/FeaturedProducts";
import StoreCategories from "@/components/pwa/StoreCategories";
import AnimatedCollectionBanner from "@/components/pwa/AnimatedCollectionBanner";
import { useAppMode } from "@/contexts/AppModeContext";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

interface StoreHomeViewProps {
  featuredProducts: any[];
  isLoading: boolean;
  onProductSelect: (product: any, timerState: TimerState) => void;
  onCategorySelect: (category: string) => void;
}

const StoreHomeView: React.FC<StoreHomeViewProps> = ({
  featuredProducts,
  isLoading,
  onProductSelect,
  onCategorySelect
}) => {
  const { isPWA } = useAppMode();
  
  return (
    <>
      <div className="mb-0 mt-0">
        <div className="flex justify-center mb-1">
          <img 
            src="/lovable-uploads/24a9187e-656c-4725-8828-f68864f96228.png" 
            alt="Timed Editions" 
            className="h-12 object-contain"
          />
        </div>

        {!isLoading && featuredProducts.length > 0 ? (
          <div className={`${isPWA ? 'w-full' : ''}`}>
            <FeaturedProducts
              products={featuredProducts}
              onProductSelect={onProductSelect}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-16">
            <p className="text-lg text-white">
              {isLoading ? "Loading products..." : "No timed editions available"}
            </p>
          </div>
        )}
      </div>

      <div className={`${isPWA ? 'px-0' : 'px-4'}`}>
        <AnimatedCollectionBanner />
        <div className={isPWA ? 'px-4' : ''}>
          <StoreCategories onCategorySelect={onCategorySelect} />
        </div>
      </div>
    </>
  );
};

export default StoreHomeView;

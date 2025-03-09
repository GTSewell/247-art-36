
import React from "react";
import FeaturedProducts from "@/components/store/FeaturedProducts";

interface TimedEditionsSectionProps {
  products: any[];
  isLoading: boolean;
  onProductSelect: (product: any, timer: any) => void;
}

const TimedEditionsSection: React.FC<TimedEditionsSectionProps> = ({
  products,
  isLoading,
  onProductSelect
}) => {
  return (
    <div>
      <div className="flex justify-center mb-1">
        <img 
          src="/lovable-uploads/24a9187e-656c-4725-8828-f68864f96228.png" 
          alt="Timed Editions" 
          className="h-14 object-contain"
        />
      </div>

      {!isLoading && products.length > 0 ? (
        <FeaturedProducts
          products={products}
          onProductSelect={onProductSelect}
        />
      ) : (
        <div className="flex justify-center items-center h-24">
          <p className="text-lg">
            {isLoading ? "Loading products..." : "No products found"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimedEditionsSection;

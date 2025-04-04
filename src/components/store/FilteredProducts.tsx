
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { logger } from "@/utils/logger";
import CategorySelector from './CategorySelector';
import LoadingState from './LoadingState';
import ProductGrid from './ProductGrid';

interface FilteredProductsProps {
  products: any[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isGeneratingImages?: boolean;
}

const FilteredProducts: React.FC<FilteredProductsProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
  isGeneratingImages = false
}) => {
  // Log products for debugging
  React.useEffect(() => {
    logger.info(`Rendering FilteredProducts for category: ${selectedCategory}`, {
      productsCount: products.length,
      firstProductImage: products[0]?.image_url,
      generating: isGeneratingImages
    });
  }, [products, selectedCategory, isGeneratingImages]);
  
  return (
    <>
      <CategorySelector 
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      <section>
        <ScrollArea className="h-[800px] rounded-md border-4 border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 py-[32px] px-[32px]">
          {isGeneratingImages ? (
            <LoadingState />
          ) : (
            <ProductGrid products={products} />
          )}
        </ScrollArea>
      </section>
    </>
  );
};

export default FilteredProducts;

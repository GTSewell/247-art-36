
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { logger } from "@/utils/logger";
import CategorySelector from './CategorySelector';
import LoadingState from './LoadingState';
import PaginatedProductGrid from './PaginatedProductGrid';
import CategoryFilters from './CategoryFilters';

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
  const [filteredProducts, setFilteredProducts] = React.useState(products);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const handleFilteredProductsChange = React.useCallback((filtered: any[]) => {
    setFilteredProducts(filtered);
  }, []);

  const handleItemsPerPageChange = React.useCallback((value: number) => {
    setItemsPerPage(value);
  }, []);

  // Update filtered products when products change
  React.useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  
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

      <section className="w-full h-[calc(100vh-280px)]">
        <ScrollArea className="h-full rounded-md border-4 border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 py-[24px] px-[24px]">
          {isGeneratingImages ? (
            <LoadingState />
          ) : (
            <div className="space-y-6">
              <CategoryFilters
                products={products}
                onFilteredProductsChange={handleFilteredProductsChange}
                categoryName={selectedCategory}
              />
              <PaginatedProductGrid
                products={filteredProducts}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </ScrollArea>
      </section>
    </>
  );
};

export default FilteredProducts;

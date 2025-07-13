import React, { useState, useCallback } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PaginatedProductGrid from './PaginatedProductGrid';
import CategoryFilters from './CategoryFilters';
import LoadingState from './LoadingState';

interface StoreCategorySectionProps {
  category: {
    id: string;
    label: string;
    image: string;
    description: string;
  };
  products: any[];
  isActive: boolean;
  isGeneratingImages: boolean;
  productCount: number;
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const StoreCategorySection: React.FC<StoreCategorySectionProps> = ({
  category,
  products,
  isActive,
  isGeneratingImages,
  productCount,
  onTriggerRef,
  onContentRef
}) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleFilteredProductsChange = useCallback((filtered: any[]) => {
    setFilteredProducts(filtered);
  }, []);

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
  }, []);

  // Update filtered products when products change
  React.useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  return (
    <AccordionItem value={category.id} className="border-none">
      <AccordionTrigger 
        ref={onTriggerRef}
        className="hover:no-underline group px-2 md:px-0 py-0 flex-col items-start md:flex-row md:items-center md:justify-between w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 
            className={`store-category-title font-agharti font-black leading-none tracking-tighter bg-clip-text transition-all duration-300 group-hover:scale-105 whitespace-nowrap w-full text-left md:w-auto ${
              isActive ? 'with-background' : ''
            }`}
            style={{
              '--category-bg-image': `url(${category.image})`
            } as React.CSSProperties}
            data-category={category.id}
            data-editable="store-title"
          >
            {category.label}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-nove mt-2 md:mt-0 md:max-w-md md:pr-8 text-left md:text-right">
            {category.description}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        {isGeneratingImages ? (
          <LoadingState />
        ) : (
          <div className="space-y-6">
            <CategoryFilters
              products={products}
              onFilteredProductsChange={handleFilteredProductsChange}
              categoryName={category.label}
            />
            <PaginatedProductGrid
              products={filteredProducts}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default StoreCategorySection;
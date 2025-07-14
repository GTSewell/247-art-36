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
  onProductClick?: (product: any) => void;
}

const StoreCategorySection: React.FC<StoreCategorySectionProps> = ({
  category,
  products,
  isActive,
  isGeneratingImages,
  productCount,
  onTriggerRef,
  onContentRef,
  onProductClick
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
        className="hover:no-underline group px-2 md:px-0 py-2 w-full cursor-pointer"
      >
        <div className={`flex w-full pr-4 transition-all duration-300 ${
          isActive 
            ? 'relative items-center min-h-[120px]' 
            : 'flex-col md:flex-row md:items-center justify-between'
        }`}>
          <h2 
            className={`store-category-title ${isActive ? 'store-category-title-expanded' : ''} font-agharti font-black leading-none tracking-tighter transition-all duration-300 group-hover:scale-105 whitespace-nowrap text-left flex-shrink-0`}
            style={{
              '--store-category-bg-image': `url(${category.image})`,
              '--category-bg-image': `url(${category.image})`
            } as React.CSSProperties}
            data-category={category.id}
            data-editable="store-title"
          >
            {category.label}
          </h2>
          <p className={`text-lg text-gray-600 dark:text-gray-300 font-nove transition-all duration-300 ${
            isActive 
              ? 'absolute left-1/2 transform -translate-x-1/2 text-center' 
              : 'text-left md:text-right mt-2 md:mt-0 flex-shrink-0'
          }`}>
            {category.description}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-6">
        {isGeneratingImages ? (
          <LoadingState />
        ) : (
          <div className="space-y-4">
            <CategoryFilters
              products={products}
              onFilteredProductsChange={handleFilteredProductsChange}
              categoryName={category.label}
            />
            <PaginatedProductGrid
              products={filteredProducts}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              onProductClick={onProductClick}
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default StoreCategorySection;
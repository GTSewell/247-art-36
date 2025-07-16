import React, { useState, useCallback } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PaginatedProductGrid from './PaginatedProductGrid';
import CategoryFilters from './CategoryFilters';
import LoadingState from './LoadingState';
import OptimizedStoreCategoryTitle from '@/components/ui/OptimizedStoreCategoryTitle';

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
  onScrollToTop?: () => void;
  isFlashing?: boolean;
}

const StoreCategorySection: React.FC<StoreCategorySectionProps> = ({
  category,
  products,
  isActive,
  isGeneratingImages,
  productCount,
  onTriggerRef,
  onContentRef,
  onProductClick,
  onScrollToTop,
  isFlashing = false
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
        className="hover:no-underline group px-2 md:px-0 py-2 w-full cursor-pointer"
      >
        <div 
          ref={onTriggerRef}
          data-trigger-ref
          className={`flex w-full pr-4 transition-all duration-300 ${
            isActive 
              ? 'flex-col md:relative md:items-start md:min-h-[120px] md:justify-center' 
              : 'flex-col md:flex-row md:items-center md:justify-between'
          }`}>
          <OptimizedStoreCategoryTitle
            imageUrl={category.image}
            className="font-agharti font-black leading-none tracking-tighter transition-all duration-300 group-hover:scale-105 whitespace-nowrap text-left md:text-left flex-shrink-0"
            isExpanded={isActive}
            isFlashing={isFlashing}
            style={{
              '--store-category-bg-image': `url(${category.image})`
            } as React.CSSProperties}
          >
            <span data-category={category.id} data-editable="store-title">
              {category.label}
            </span>
          </OptimizedStoreCategoryTitle>
          <p className={`text-lg md:text-4xl text-gray-600 dark:text-gray-300 font-agharti font-semibold tracking-wide transition-all duration-300 ${
            isActive 
              ? 'text-left md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:text-center mt-2 self-start md:self-auto' 
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
              onScrollToTop={onScrollToTop}
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default StoreCategorySection;
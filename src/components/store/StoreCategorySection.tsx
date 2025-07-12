import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ProductGrid from './ProductGrid';
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
  return (
    <AccordionItem value={category.id} className="border-none">
      <AccordionTrigger 
        ref={onTriggerRef}
        className="hover:no-underline group px-0 flex-col items-start md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 
            className="store-category-title font-agharti font-black leading-none tracking-tighter bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105"
            style={{
              '--category-bg-image': `url(${category.image})`
            } as React.CSSProperties}
            data-category={category.id}
            data-editable="store-title"
          >
            {category.label}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-nove mt-2 md:mt-0 md:max-w-md text-left md:text-right">
            {category.description}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{productCount} {productCount === 1 ? 'item' : 'items'} available</span>
          </div>
        </div>
        
        {isGeneratingImages ? (
          <LoadingState />
        ) : (
          <ProductGrid products={products} />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default StoreCategorySection;
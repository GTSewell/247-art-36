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
}

const StoreCategorySection: React.FC<StoreCategorySectionProps> = ({
  category,
  products,
  isActive,
  isGeneratingImages,
  productCount
}) => {
  return (
    <AccordionItem value={category.id} className="border-none">
      <AccordionTrigger className="hover:no-underline group px-0">
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
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-16">
        <div className="mb-8">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 font-nove">
            {category.description}
          </p>
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
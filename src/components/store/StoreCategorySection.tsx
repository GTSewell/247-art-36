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
      <AccordionTrigger className="hover:no-underline group py-8 px-0">
        <h2 
          className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] 2xl:text-[32rem] font-agharti font-black leading-none tracking-tighter bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105"
          style={{
            backgroundImage: `url(${category.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            WebkitTextStroke: '1px black'
          } as React.CSSProperties}
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
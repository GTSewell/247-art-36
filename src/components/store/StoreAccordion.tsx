import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { storeCategories } from './utils/categoryUtils';
import StoreCategorySection from './StoreCategorySection';

interface StoreAccordionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  getProductsForCategory: (category: string) => any[];
  isGeneratingImages: boolean;
}

const StoreAccordion: React.FC<StoreAccordionProps> = ({
  selectedCategory,
  onCategoryChange,
  getProductsForCategory,
  isGeneratingImages
}) => {
  const handleValueChange = (value: string) => {
    // The accordion returns an array, but we only allow single selection
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue && newValue !== selectedCategory) {
      onCategoryChange(newValue);
    }
  };

  return (
    <section className="mb-8">
      <Accordion 
        type="single" 
        value={selectedCategory}
        onValueChange={handleValueChange}
        collapsible
        className="w-full space-y-4"
      >
        {storeCategories.map(category => {
          const products = getProductsForCategory(category.id);
          return (
            <StoreCategorySection
              key={category.id}
              category={category}
              products={products}
              isActive={selectedCategory === category.id}
              isGeneratingImages={isGeneratingImages && selectedCategory === category.id}
              productCount={products.length}
            />
          );
        })}
      </Accordion>
    </section>
  );
};

export default StoreAccordion;
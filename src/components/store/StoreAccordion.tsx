import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { storeCategories } from './utils/categoryUtils';
import StoreCategorySection from './StoreCategorySection';
import { useEnhancedAccordionScroll } from '@/hooks/useEnhancedAccordionScroll';
import { useStoreSequentialFlashPreloader } from '@/hooks/useStoreSequentialFlashPreloader';

interface StoreAccordionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  getProductsForCategory: (category: string) => any[];
  isGeneratingImages: boolean;
  onProductClick?: (product: any) => void;
}

const StoreAccordion: React.FC<StoreAccordionProps> = ({
  selectedCategory,
  onCategoryChange,
  getProductsForCategory,
  isGeneratingImages,
  onProductClick
}) => {
  const { registerTrigger, registerContent, handleAccordionChange } = useEnhancedAccordionScroll();
  
  // Sequential flash preloader for store category images
  const { flashStates } = useStoreSequentialFlashPreloader();

  const handleScrollToTop = () => {
    const triggerElement = selectedCategory ? 
      document.querySelector(`[data-category="${selectedCategory}"]`)?.closest('[data-trigger-ref]') || 
      document.querySelector(`[data-category="${selectedCategory}"]`)?.parentElement?.parentElement 
      : null;
    
    if (triggerElement) {
      const elementTop = triggerElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  };

  const handleValueChange = (value: string) => {
    // The accordion returns an array, but we only allow single selection
    const newValue = Array.isArray(value) ? value[0] : value;
    handleAccordionChange(newValue, selectedCategory, onCategoryChange);
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
              onTriggerRef={(element) => registerTrigger(category.id, element)}
              onContentRef={(element) => registerContent(category.id, element)}
              onProductClick={onProductClick}
              onScrollToTop={handleScrollToTop}
              isFlashing={flashStates[category.id]?.isFlashing || false}
            />
          );
        })}
      </Accordion>
    </section>
  );
};

export default StoreAccordion;
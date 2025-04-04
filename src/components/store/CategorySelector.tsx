
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { storeCategories, getCategoryColor } from './utils/categoryUtils';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="mb-8">
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-6 gap-4'}`}>
        {storeCategories.map(category => (
          <button 
            key={category.id} 
            onClick={() => onCategoryChange(category.id)} 
            className={`py-[15px] px-2 rounded-md transition-all duration-200 hover:bg-opacity-80 border-2 ${
              selectedCategory === category.id 
                ? `${getCategoryColor(category.id)} text-black border-black` 
                : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <span className={`font-nove text-xs leading-tight ${selectedCategory === category.id ? 'text-black font-semibold' : 'text-gray-800 dark:text-gray-200 font-normal'} md:text-lg`}>
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySelector;

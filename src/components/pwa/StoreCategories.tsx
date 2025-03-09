
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

interface StoreCategoriesProps {
  onCategorySelect: (category: string) => void;
}

const StoreCategories: React.FC<StoreCategoriesProps> = ({ onCategorySelect }) => {
  const isMobile = useIsMobile();
  
  const categories = [
    { id: 'original', label: 'ORIGINAL ARTWORK', color: 'bg-zap-yellow' },
    { id: 'signed', label: 'SIGNED & NUMBERED', color: 'bg-zap-blue' },
    { id: 'sticker', label: 'STICKERS & FUN STUFF', color: 'bg-zap-red' },
    { id: 'merch', label: 'T-SHIRTS & APPAREL', color: 'bg-zap-yellow' },
    { id: 'print', label: 'ART PRINTS & POSTERS', color: 'bg-zap-blue' },
    { id: 'collection', label: 'THE 247 COLLECTION', color: 'bg-zap-red' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`
            p-3 rounded-lg border-4 border-white/80 shadow-md
            ${category.color}
            transition-all duration-200 active:scale-95
            flex items-center justify-center text-center h-20
          `}
        >
          <span className="font-nove text-white text-base leading-tight drop-shadow-md">
            {category.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StoreCategories;


import React from 'react';
import { ChevronLeft } from "lucide-react";
import CategoryProducts from "@/components/pwa/CategoryProducts";
import { logger } from "@/utils/logger";

interface ProductCategoryViewProps {
  categoryId: string;
  products: any[];
  onBack: () => void;
  onProductClick?: (product: any) => void;
}

const ProductCategoryView: React.FC<ProductCategoryViewProps> = ({
  categoryId,
  products,
  onBack,
  onProductClick
}) => {
  const getCategoryDisplayName = (categoryId: string) => {
    switch(categoryId) {
      case 'original': return 'ORIGINAL ARTWORK';
      case 'signed': return 'SIGNED & NUMBERED';
      case 'sticker': return 'STICKERS & FUN STUFF';
      case 'merch': return 'T-SHIRTS & APPAREL';
      case 'print': return 'ART PRINTS & POSTERS';
      case 'collection': return 'THE 247 COLLECTION';
      default: return categoryId.toUpperCase();
    }
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="flex items-center text-white bg-white/20 rounded-full p-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-nove text-white text-center uppercase tracking-wide">
          {getCategoryDisplayName(categoryId)}
        </h1>
        <div className="w-10"></div>
      </div>
      <CategoryProducts 
        products={products} 
        categoryName={categoryId}
        onProductClick={onProductClick}
      />
    </div>
  );
};

export default ProductCategoryView;

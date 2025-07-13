
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Zap, ShoppingCart } from "lucide-react";
import { handleImageError, getProductImageUrl } from './utils/imageUtils';

interface ProductCardProps {
  product: any;
  onProductClick?: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const isMobile = useIsMobile();
  
  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when button is clicked
  };

  return (
    <div className="group h-full flex flex-col cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-square overflow-hidden rounded-none mb-1 bg-gray-100 dark:bg-gray-700">
        <img 
          src={getProductImageUrl(product)} 
          alt={product.name} 
          data-product-id={product.id}
          data-category={product.category}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          onError={handleImageError} 
        />
        {product.is_limited_edition && (
          <div className="absolute top-2 right-2">
            <div className="bg-zap-yellow text-black px-2 py-1 rounded-full flex items-center gap-1">
              <Zap size={14} />
              <span className="text-xs font-medium">Limited</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="font-medium mb-0.5 text-sm md:text-base dark:text-white leading-tight truncate">{product.name}</h3>
        {product.artists && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-semibold leading-none truncate">
            By {product.artists.name}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-light leading-none">${product.price}</p>
          <Button 
            size={isMobile ? "icon" : "sm"} 
            className="bg-slate-700 hover:bg-slate-600 text-white h-8 w-8 md:w-auto md:h-8"
            onClick={handleButtonClick}
          >
            {isMobile ? <ShoppingCart className="h-4 w-4" /> : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Add to Art
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

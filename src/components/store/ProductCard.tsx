
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Zap, ShoppingCart } from "lucide-react";
import { handleImageError, getProductImageUrl } from './utils/imageUtils';

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg mb-2 bg-gray-100 dark:bg-gray-700">
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
      <h3 className="font-medium mb-1 text-sm md:text-base font-nove dark:text-white">{product.name}</h3>
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">${product.price}</p>
        <Button size={isMobile ? "icon" : "sm"} className="bg-zap-red hover:bg-zap-blue h-8 w-8 md:w-auto md:h-9">
          {isMobile ? <ShoppingCart className="h-4 w-4" /> : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
      {product.artists && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-nove">
          By {product.artists.name}
        </p>
      )}
    </div>
  );
};

export default ProductCard;

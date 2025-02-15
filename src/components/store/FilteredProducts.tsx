
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap } from "lucide-react";

interface FilteredProductsProps {
  products: any[];
  selectedCategory: 'print' | 'merch' | 'sticker';
  onCategoryChange: (category: 'print' | 'merch' | 'sticker') => void;
}

const FilteredProducts: React.FC<FilteredProductsProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <>
      <section className="mb-8">
        <div className="flex gap-4 justify-center">
          <Button 
            variant={selectedCategory === 'print' ? 'default' : 'outline'} 
            onClick={() => onCategoryChange('print')} 
            className="min-w-[120px]"
          >
            Prints
          </Button>
          <Button 
            variant={selectedCategory === 'merch' ? 'default' : 'outline'} 
            onClick={() => onCategoryChange('merch')} 
            className="min-w-[120px]"
          >
            Merch
          </Button>
          <Button 
            variant={selectedCategory === 'sticker' ? 'default' : 'outline'} 
            onClick={() => onCategoryChange('sticker')} 
            className="min-w-[120px]"
          >
            Stickers
          </Button>
        </div>
      </section>

      <section>
        <ScrollArea className="h-[800px] rounded-md border-4 border-black p-4 bg-zap-yellow py-[32px] px-[32px]">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.name} 
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
                <h3 className="font-medium mb-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">${product.price}</p>
                  <Button size="sm" className="bg-zap-red hover:bg-zap-blue">
                    <Zap className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
                {product.artists && (
                  <p className="text-sm text-gray-500 mt-2">
                    By {product.artists.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>
    </>
  );
};

export default FilteredProducts;

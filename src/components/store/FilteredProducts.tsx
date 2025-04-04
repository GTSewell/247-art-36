
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, ShoppingCart, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { logger } from "@/utils/logger";

interface FilteredProductsProps {
  products: any[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isGeneratingImages?: boolean;
}

const FilteredProducts: React.FC<FilteredProductsProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
  isGeneratingImages = false
}) => {
  const isMobile = useIsMobile();
  
  // Log products for debugging
  React.useEffect(() => {
    logger.info(`Rendering FilteredProducts for category: ${selectedCategory}`, {
      productsCount: products.length,
      firstProductImage: products[0]?.image_url,
      generating: isGeneratingImages
    });
  }, [products, selectedCategory, isGeneratingImages]);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error("Image failed to load", { src: e.currentTarget.src });
    e.currentTarget.src = '/placeholder.svg';
  };
  
  const categories = [{
    id: 'original',
    label: 'ORIGINAL ARTWORK',
    color: 'bg-zap-yellow'
  }, {
    id: 'signed',
    label: 'SIGNED & NUMBERED',
    color: 'bg-zap-blue'
  }, {
    id: 'sticker',
    label: 'STICKERS & FUN STUFF',
    color: 'bg-zap-red'
  }, {
    id: 'merch',
    label: 'T-SHIRTS & APPAREL',
    color: 'bg-zap-yellow'
  }, {
    id: 'print',
    label: 'ART PRINTS & POSTERS',
    color: 'bg-zap-blue'
  }, {
    id: 'collection',
    label: 'THE 247 COLLECTION',
    color: 'bg-zap-red'
  }];

  const getCategoryColor = (categoryId: string) => {
    switch(categoryId) {
      case 'original':
      case 'merch':
        return 'bg-zap-yellow';
      case 'signed':
      case 'print':
        return 'bg-zap-blue';
      case 'sticker':
      case 'collection':
        return 'bg-zap-red';
      default:
        return 'bg-gray-200';
    }
  };

  // Force image reload with unique timestamp
  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.svg';
    
    // Make sure we're using the proper base URL
    let imageUrl = url;
    if (url.includes('undefined')) {
      // Fix incorrect URL formation by removing 'undefined' from the path
      imageUrl = url.replace('/undefined', '');
    }
    
    // Add cache busting parameter
    const baseUrl = imageUrl.split('?')[0]; // Remove any existing query params
    return `${baseUrl}?t=${Date.now()}`;
  };

  return <>
      <section className="mb-8">
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-6 gap-4'}`}>
          {categories.map(category => (
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

      <section>
        <ScrollArea className="h-[800px] rounded-md border-4 border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 py-[32px] px-[32px]">
          {isGeneratingImages ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-zap-blue" />
              <p className="text-lg font-medium">Generating product images...</p>
              <p className="text-sm text-gray-500">This may take a minute to complete</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-2 bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={getImageUrl(product.image_url)} 
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
              ))}
            </div>
          )}
        </ScrollArea>
      </section>
    </>;
};

export default FilteredProducts;

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
    const img = e.currentTarget;
    const productId = img.getAttribute('data-product-id') || '';
    const category = img.getAttribute('data-category') || '';
    img.src = getCategoryFallbackImage(category, getNumberFromProductId(productId));
  };
  
  const getNumberFromProductId = (productId: string): number => {
    const parts = productId.split('-');
    const lastPart = parts[parts.length - 1];
    const num = parseInt(lastPart, 10);
    return isNaN(num) ? 1 : num;
  };
  
  const getCategoryFallbackImage = (category: string, index: number = 1): string => {
    const imageIndex = Math.max(1, Math.min(6, index));
    
    const categoryImages: Record<string, string[]> = {
      'original': [
        '/lovable-uploads/2f884c19-75ec-4f8c-a501-ebc90a17c2c6.png',
        '/lovable-uploads/77d6eca3-c8ee-469f-8975-11645265224b.png',
        '/lovable-uploads/2ed59a3d-02e9-41db-97a4-722e0a36b249.png',
        '/lovable-uploads/3ab59a55-2f79-43d8-970b-05c9af0af079.png',
        '/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png',
        '/lovable-uploads/e3632eac-612c-482e-aad1-8d4fd3b2947c.png'
      ],
      'signed': [
        '/lovable-uploads/5d0599b7-4561-43b3-af8b-550a349ed4fc.png',
        '/lovable-uploads/e87b6304-c331-43ea-8732-079538ff941a.png',
        '/lovable-uploads/cf5565b7-f7b3-4c38-bdbb-99b1bfb3b192.png',
        '/lovable-uploads/af63a2ba-f2fc-4794-af1b-a504b0c294de.png',
        '/lovable-uploads/ba2acde7-f602-4a0e-b52f-f5b1b5a3689e.png',
        '/lovable-uploads/e0deff39-8fe2-4550-ab0c-1e69017df558.png'
      ],
      'collection': [
        '/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png',
        '/lovable-uploads/f0f9a807-bce8-48e7-86d9-73deb089ec3b.png',
        '/lovable-uploads/7ab2b4e1-a00b-4cd8-b039-5863c96b000f.png',
        '/lovable-uploads/c7f799f3-cf1b-4b9f-8c6c-a680bb4f0add.png',
        '/lovable-uploads/7d2e39fb-84b5-4bfc-9f09-707fa8e985e1.png',
        '/lovable-uploads/cdc0cbb8-b760-4aba-b9aa-3490af08c781.png'
      ]
    };
    
    if (!categoryImages[category]) {
      return '/placeholder.svg';
    }
    
    return categoryImages[category][imageIndex - 1] || categoryImages[category][0];
  };
  
  const getProductImageUrl = (product: any): string => {
    if (product.image_url && !product.image_url.includes('undefined')) {
      return `${product.image_url}?t=${Date.now()}`;
    }
    
    return getCategoryFallbackImage(product.category, getNumberFromProductId(product.id));
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
              ))}
            </div>
          )}
        </ScrollArea>
      </section>
    </>;
};

export default FilteredProducts;

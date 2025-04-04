
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
    img.src = getArtworkImage(category, getNumberFromProductId(productId));
  };
  
  const getNumberFromProductId = (productId: string): number => {
    const parts = productId.split('-');
    const lastPart = parts[parts.length - 1];
    const num = parseInt(lastPart, 10);
    return isNaN(num) ? 1 : num;
  };
  
  // New function to get artwork images from Unsplash
  const getArtworkImage = (category: string, index: number = 1): string => {
    const imageIndex = Math.max(1, Math.min(6, index));
    
    // Different image sets for each category
    const categoryImages: Record<string, string[]> = {
      'original': [
        'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&auto=format', // river between mountains
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format', // pine trees
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format', // low angle trees
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format', // sun through trees
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format', // mountain sun rays
        'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600&auto=format', // blue starry night
      ],
      'signed': [
        'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=600&auto=format', // brown wavy structure
        'https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=600&auto=format', // clear glass roof
        'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?w=600&auto=format', // glass building
        'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&auto=format', // empty cathedral
        'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=600&auto=format', // black and red building
        'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&auto=format', // blue and white building
      ],
      'collection': [
        'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=600&auto=format', // herd of sheep
        'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&auto=format', // orange and white cat
        'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&auto=format', // two deer
        'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=600&auto=format', // antelope and zebra
        'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=600&auto=format', // brown ox on mountain
        'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&auto=format', // grey tabby kitten
      ],
      'sticker': [
        'https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=600&auto=format', // bees
        'https://images.unsplash.com/photo-1452960962994-acf4fd70b632?w=600&auto=format', // sheep
        'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=600&auto=format', // humpback whale
        'https://images.unsplash.com/photo-1439886183900-e79ec0057170?w=600&auto=format', // two deer
        'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=600&auto=format', // brown cattle
        'https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=600&auto=format', // penguins
      ],
      'merch': [
        'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=600&auto=format', // brown deer near trees
        'https://images.unsplash.com/photo-1438565434616-3ef039228b15?w=600&auto=format', // two mountain goats
        'https://images.unsplash.com/photo-1501286353178-1ec871bba838?w=600&auto=format', // monkey with banana
        'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=600&auto=format', // five camels on field
        'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=600&auto=format', // four brown horses
        'https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=600&auto=format', // comodo dragons
      ],
      'print': [
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format', // foggy mountains
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&auto=format', // ocean wave
        'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=600&auto=format', // mountain alps
        'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&auto=format', // river surrounded by rocks
        'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=600&auto=format', // desert sand
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&auto=format', // trees near rocky mountain
      ]
    };
    
    // If category doesn't exist in our mapping, use a default image
    if (!categoryImages[category]) {
      return 'https://images.unsplash.com/photo-1548502499-ef49e8cf98d4?w=600&auto=format';
    }
    
    return categoryImages[category][imageIndex - 1] || categoryImages[category][0];
  };
  
  const getProductImageUrl = (product: any): string => {
    if (product.image_url && !product.image_url.includes('undefined') && !product.image_url.includes('lovable-uploads')) {
      return `${product.image_url}?t=${Date.now()}`;
    }
    
    return getArtworkImage(product.category, getNumberFromProductId(product.id));
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

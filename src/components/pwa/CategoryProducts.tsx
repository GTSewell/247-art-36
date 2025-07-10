
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface CategoryProductsProps {
  products: any[];
  categoryName: string;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ 
  products, 
  categoryName 
}) => {
  const { addItem } = useCart();
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };
  
  const handleAddToCart = (product: any) => {
    // Transform product to ensure proper format for cart
    const cartItem = {
      id: product.id.toString(),
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image_url: product.image_url || '/placeholder.svg',
      artist: product.artists || { name: product.artist_name }
    };
    
    addItem(cartItem);
    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`
    });
  };

  // If no products found, display a message
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zap-yellow rounded-lg border-4 border-white min-h-[300px]">
        <p className="text-xl font-nove text-center mb-4">No products found in this category</p>
        <p className="text-base text-center">Check back soon for new additions!</p>
      </div>
    );
  }

  // Format the category name for display
  const formatCategoryName = (name: string) => {
    // Convert category ID to display name
    switch(name) {
      case 'original': return 'ORIGINAL ARTWORK';
      case 'signed': return 'SIGNED & NUMBERED';
      case 'sticker': return 'STICKERS & FUN STUFF';
      case 'merch': return 'T-SHIRTS & APPAREL';
      case 'print': return 'ART PRINTS & POSTERS';
      case 'collection': return 'THE 247 COLLECTION';
      default: return name.toUpperCase();
    }
  };

  // Debug logging for category products
  React.useEffect(() => {
    console.log(`🏪 CategoryProducts for ${categoryName}:`, {
      categoryName,
      productCount: products.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        artist: p.artists?.name || (p as any).artist_name
      }))
    });
  }, [products, categoryName]);

  return (
    <div className="bg-zap-yellow rounded-lg border-4 border-white overflow-hidden h-full">
      <ScrollArea className="h-[calc(100vh-130px)]">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-2 bg-white">
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
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
                <h3 className="font-medium mb-1 text-sm font-nove truncate">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 text-base font-bold">${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}</p>
                  <Button 
                    size="icon" 
                    className="bg-zap-red hover:bg-zap-blue h-8 w-8"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
                 {(product.artists?.name || (product as any).artist_name) && (
                   <p className="text-xs text-gray-700 mt-1 truncate">
                     By {product.artists?.name || (product as any).artist_name}
                   </p>
                 )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryProducts;

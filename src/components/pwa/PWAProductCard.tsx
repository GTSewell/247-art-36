import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface PWAProductCardProps {
  product: any;
}

const PWAProductCard: React.FC<PWAProductCardProps> = ({ product }) => {
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

  return (
    <div className="group">
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
        <p className="text-gray-800 text-base font-bold">
          ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
        </p>
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
  );
};

export default PWAProductCard;
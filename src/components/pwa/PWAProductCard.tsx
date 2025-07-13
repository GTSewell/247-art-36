import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface PWAProductCardProps {
  product: any;
  onProductClick?: (product: any) => void;
}

const PWAProductCard: React.FC<PWAProductCardProps> = ({ product, onProductClick }) => {
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

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    handleAddToCart(product);
  };

  return (
    <div className="group h-full flex flex-col cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-square overflow-hidden rounded-none mb-1 bg-white">
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
      <div className="flex flex-col flex-1">
        <h3 className="font-medium mb-0.5 text-sm leading-tight truncate">{product.name}</h3>
        {(product.artists?.name || (product as any).artist_name) && (
          <p className="text-xs text-gray-700 mt-1 font-semibold leading-none truncate">
            By {product.artists?.name || (product as any).artist_name}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-gray-800 text-base font-light leading-none">
            ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
          </p>
          <Button 
            size="icon" 
            className="bg-slate-700 hover:bg-slate-600 text-white h-8 w-8"
            onClick={handleButtonClick}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAProductCard;
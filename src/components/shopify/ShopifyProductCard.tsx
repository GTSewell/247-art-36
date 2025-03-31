
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useShopifyCart } from '@/contexts/ShopifyCartContext';
import { ShopifyProduct } from '@/hooks/useShopifyProducts';

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  onProductClick?: (product: ShopifyProduct) => void;
}

const ShopifyProductCard: React.FC<ShopifyProductCardProps> = ({ 
  product, 
  onProductClick 
}) => {
  const { addItem } = useShopifyCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent product click when adding to cart
    
    addItem({
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      image_url: product.image_url,
      variant_id: product.variants[0]?.id,
      artist_id: product.artist_id
    });
  };
  
  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };
  
  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };
  
  // Handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer h-full transition-transform hover:shadow-lg hover:scale-[1.01]"
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={handleImageError}
        />
        {!product.availableForSale && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Sold Out</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-base line-clamp-1 mb-1">{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="font-medium">{formatPrice(product.price)}</span>
          <Button 
            size="sm" 
            className="bg-zap-red hover:bg-zap-blue"
            onClick={handleAddToCart}
            disabled={!product.availableForSale}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopifyProductCard;

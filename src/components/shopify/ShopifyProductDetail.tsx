
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";
import { useShopifyCart } from '@/contexts/ShopifyCartContext';
import { ShopifyProduct } from '@/hooks/useShopifyProducts';
import { Badge } from '@/components/ui/badge';

interface ShopifyProductDetailProps {
  product: ShopifyProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShopifyProductDetail: React.FC<ShopifyProductDetailProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { addItem } = useShopifyCart();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  
  if (!product) return null;
  
  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId);
  };
  
  const handleAddToCart = () => {
    // Find the selected variant, or use the first one if none selected
    const variant = product.variants.find(v => v.id === selectedVariant) || product.variants[0];
    
    addItem({
      id: product.id,
      title: product.title,
      price: parseFloat(variant ? variant.price : product.price),
      image_url: product.image_url,
      variant_id: variant?.id,
      artist_id: product.artist_id
    });
    
    onClose();
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="aspect-square overflow-hidden rounded-md border">
            <img 
              src={product.image_url || '/placeholder.svg'} 
              alt={product.title} 
              className="w-full h-full object-cover"
              onError={(e) => e.currentTarget.src = '/placeholder.svg'}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {!product.availableForSale && (
                  <Badge variant="destructive">Sold Out</Badge>
                )}
              </div>
              
              <DialogDescription className="text-sm whitespace-pre-line">
                {product.description}
              </DialogDescription>
            </div>
            
            {product.variants.length > 1 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Options</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant === variant.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVariantSelect(variant.id)}
                      disabled={!variant.availableForSale}
                    >
                      {variant.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            className="w-full bg-zap-red hover:bg-zap-blue text-white"
            onClick={handleAddToCart}
            disabled={!product.availableForSale}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShopifyProductDetail;

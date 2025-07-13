
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  isDisabled?: boolean;
  product?: any;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  isDisabled = false,
  product 
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        artist: product.artists
      });
      toast.success("Added to cart!", {
        description: "This item has been added to your cart."
      });
    } else {
      toast.error("Unable to add to cart", {
        description: "Product information is missing."
      });
    }
  };

  return (
    <Button 
      className={`w-full py-3 flex items-center justify-center space-x-2 rounded-lg ${
        isDisabled 
          ? 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-600 cursor-not-allowed text-white dark:text-gray-200' 
          : 'bg-slate-700 hover:bg-slate-800 transition-colors text-white'
      }`}
      onClick={handleAddToCart}
      disabled={isDisabled}
    >
      <ShoppingCart size={18} />
      <span>{isDisabled ? 'Edition Closed' : 'Add to Art'}</span>
    </Button>
  );
};

export default AddToCartButton;

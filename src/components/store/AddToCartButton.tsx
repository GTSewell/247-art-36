
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  isDisabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ isDisabled = false }) => {
  const handleAddToCart = () => {
    toast.success("Added to cart!", {
      description: "This item has been added to your cart."
    });
  };

  return (
    <Button 
      className={`w-full py-3 flex items-center justify-center space-x-2 ${
        isDisabled 
          ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
          : 'bg-zap-red hover:bg-red-600 transition-colors'
      }`}
      onClick={handleAddToCart}
      disabled={isDisabled}
    >
      <ShoppingCart size={18} />
      <span>{isDisabled ? 'Edition Closed' : 'Add to Cart'}</span>
    </Button>
  );
};

export default AddToCartButton;


import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  isDisabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ isDisabled = false }) => {
  const handleAddToCart = () => {
    toast.success("Added to art!", {
      description: "This item has been added to your collection."
    });
  };

  return (
    <Button 
      className={`w-full py-3 flex items-center justify-center space-x-2 rounded-lg ${
        isDisabled 
          ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
          : 'bg-[#ea384c] hover:bg-red-600 transition-colors'
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

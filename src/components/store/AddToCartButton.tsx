
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddToCartButton: React.FC = () => {
  const handleAddToCart = () => {
    toast.success("Added to cart!", {
      description: "This item has been added to your cart."
    });
  };

  return (
    <Button 
      className="w-full bg-zap-red hover:bg-zap-blue text-white py-3"
      onClick={handleAddToCart}
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;

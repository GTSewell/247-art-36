
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

interface ProductItemProps {
  product: any;
  initialTime: TimerState;
  onSelect: (product: any, timerState: TimerState) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, initialTime, onSelect }) => {
  const { addItem } = useCart();
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      artist: product.artists
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      className="relative group overflow-hidden rounded-lg cursor-pointer h-64 md:h-72"
      onClick={() => onSelect(product, initialTime)}
    >
      <div className="absolute top-1 right-1 z-10">
        <CountdownTimer
          initialHours={initialTime.hours}
          initialMinutes={initialTime.minutes}
          initialSeconds={initialTime.seconds}
          productId={product.id}
        />
      </div>
      <div className="h-full overflow-hidden">
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" 
          onError={handleImageError} 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-1 left-1 right-1">
          <h3 className="text-white text-sm font-bold">{product.name}</h3>
          <p className="text-white/90 text-xs">${product.price}</p>
          <Button 
            className="w-full mt-1 bg-zap-red hover:bg-zap-blue text-xs py-0.5" 
            size="sm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductItem;

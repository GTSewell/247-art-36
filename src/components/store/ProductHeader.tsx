
import React from 'react';
import CountdownTimer from "./CountdownTimer";

interface ProductHeaderProps {
  name: string;
  artistName: string;
  productId: string;
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  name, 
  artistName, 
  productId, 
  timeLeft 
}) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{name}</h2>
        <p className="text-sm md:text-base text-muted-foreground">By {artistName}</p>
      </div>
      {timeLeft && productId && (
        <CountdownTimer 
          initialHours={timeLeft.hours}
          initialMinutes={timeLeft.minutes}
          initialSeconds={timeLeft.seconds}
          productId={productId}
        />
      )}
    </div>
  );
};

export default ProductHeader;

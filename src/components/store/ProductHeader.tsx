
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
  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{name}</h2>
          <p className="text-sm text-muted-foreground">By {artistName || 'Unknown Artist'}</p>
        </div>
        
        {!isExpired && timeLeft && productId && (
          <CountdownTimer 
            initialHours={timeLeft.hours}
            initialMinutes={timeLeft.minutes}
            initialSeconds={timeLeft.seconds}
            productId={productId}
          />
        )}
      </div>
      
      <div className="flex items-center">
        <span className="text-lg md:text-xl font-semibold">$49.99</span>
        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Limited Edition</span>
      </div>
    </div>
  );
};

export default ProductHeader;

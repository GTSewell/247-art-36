import React from 'react';

interface RegularProductHeaderProps {
  name: string;
  artistName?: string;
  price: number;
  isLimitedEdition?: boolean;
}

const RegularProductHeader: React.FC<RegularProductHeaderProps> = ({ 
  name, 
  artistName, 
  price,
  isLimitedEdition = false
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight dark:text-white">{name}</h2>
          <p className="text-sm text-muted-foreground dark:text-gray-300">By {artistName || 'Unknown Artist'}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <span className="text-lg md:text-xl font-semibold dark:text-white">${price.toFixed(2)}</span>
        {isLimitedEdition && (
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs rounded-full">Limited Edition</span>
        )}
      </div>
    </div>
  );
};

export default RegularProductHeader;
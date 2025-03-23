import React from "react";
import { Check, X } from "lucide-react";
import { TableCell } from "@/components/ui/table";

interface FeatureCellProps {
  value: boolean | string;
  hasDiscount?: boolean;
  type?: 'studioArtist' | 'featureArtist' | 'signatureArtist';
  stackText?: boolean;
}

const FeatureCell = ({ value, hasDiscount, type, stackText }: FeatureCellProps) => {
  if (hasDiscount && typeof value === 'string') {
    let originalPrice = '';
    if (type === 'studioArtist') {
      originalPrice = '$1495';
    } else if (type === 'featureArtist') {
      originalPrice = '$1995';
    } else if (type === 'signatureArtist') {
      originalPrice = '$1495';
    }
    
    if (type === 'signatureArtist') {
      return (
        <TableCell className="text-center p-1">
          <div className="flex items-center justify-center space-x-2">
            <span className="line-through text-gray-500 text-xs sm:text-sm">{originalPrice}</span>
            <span className="text-sm sm:text-base font-medium">{value}</span>
          </div>
        </TableCell>
      );
    }
    
    return (
      <TableCell className="text-center p-1">
        <div className="flex flex-col items-center justify-center">
          <span className="line-through text-gray-500 text-xs sm:text-sm">{originalPrice}</span>
          <span className="text-sm sm:text-base font-medium">{value}</span>
        </div>
      </TableCell>
    );
  }
  
  if (stackText && typeof value === 'string') {
    let parts;
    
    if (value.includes(' (')) {
      parts = value.split(' (');
      parts[1] = parts[1].replace(')', '');
      
      return (
        <TableCell className="text-center p-1">
          <div className="stacked-text items-center">
            <span className="font-medium">{parts[0]}</span>
            <span>({parts[1]})</span>
          </div>
        </TableCell>
      );
    }
    
    if (value.includes(' to ')) {
      parts = value.split(' to ');
      
      return (
        <TableCell className="text-center p-1">
          <div className="stacked-text items-center">
            <span className="font-medium">{parts[0]}</span>
            <span>to {parts[1]}</span>
          </div>
        </TableCell>
      );
    }
    
    if (value.includes(' every ')) {
      parts = value.split(' every ');
      
      return (
        <TableCell className="text-center p-1">
          <div className="stacked-text items-center">
            <span className="font-medium">{parts[0]}</span>
            <span>every {parts[1]}</span>
          </div>
        </TableCell>
      );
    }
  }
  
  return (
    <TableCell className="text-center p-1">
      {typeof value === "boolean" ? (
        value ? (
          <Check className="mx-auto text-green-500 h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <X className="mx-auto text-red-500 h-4 w-4 sm:h-5 sm:w-5" />
        )
      ) : (
        <span className="text-sm sm:text-base">{value}</span>
      )}
    </TableCell>
  );
};

export default FeatureCell;

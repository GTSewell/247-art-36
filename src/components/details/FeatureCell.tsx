
import React from "react";
import { Check, X } from "lucide-react";
import { TableCell } from "@/components/ui/table";

interface FeatureCellProps {
  value: boolean | string;
  hasDiscount?: boolean;
  type?: 'studioArtist' | 'featureArtist' | 'signatureArtist';
}

const FeatureCell = ({ value, hasDiscount, type }: FeatureCellProps) => {
  if (hasDiscount && typeof value === 'string') {
    let originalPrice = '';
    if (type === 'studioArtist') {
      originalPrice = '$1495';
    } else if (type === 'featureArtist') {
      originalPrice = '$1995';
    }
    
    return (
      <TableCell className="text-center p-1 sm:p-4">
        <div className="flex flex-col items-center justify-center">
          <span className="line-through text-gray-500 text-xs sm:text-sm">{originalPrice}</span>
          <span className="text-xs sm:text-base">{value}</span>
        </div>
      </TableCell>
    );
  }
  
  return (
    <TableCell className="text-center p-1 sm:p-4">
      {typeof value === "boolean" ? (
        value ? (
          <Check className="mx-auto text-green-500 h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <X className="mx-auto text-red-500 h-4 w-4 sm:h-5 sm:w-5" />
        )
      ) : (
        <span className="text-xs sm:text-base">{value}</span>
      )}
    </TableCell>
  );
};

export default FeatureCell;


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
      <TableCell className="text-center">
        <div className="flex flex-col items-center justify-center">
          <span className="line-through text-gray-500">{originalPrice}</span>
          <span>{value}</span>
        </div>
      </TableCell>
    );
  }
  
  return (
    <TableCell className="text-center">
      {typeof value === "boolean" ? (
        value ? (
          <Check className="mx-auto text-green-500" />
        ) : (
          <X className="mx-auto text-red-500" />
        )
      ) : (
        <span>{value}</span>
      )}
    </TableCell>
  );
};

export default FeatureCell;

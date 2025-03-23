
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import FeatureCell from "./FeatureCell";
import type { Feature } from "./data/featuresData";

interface FeatureRowProps {
  feature: Feature;
  index: number;
  isExpanded: boolean;
  toggleRow: (index: number) => void;
}

// Features that need text stacking on mobile
const stackableFeatures = [
  "Exhibition Duration",
  "Gallery Commission (Original Artwork)",
  "24/7 Video Wall & Projection Profile",
  "Artist Commission (Retail Production)",
  "Artwork Changes"
];

const FeatureRow = ({ feature, index, isExpanded, toggleRow }: FeatureRowProps) => {
  const needsStacking = stackableFeatures.includes(feature.name);
  
  return (
    <React.Fragment>
      <TableRow 
        className={cn(
          index % 2 === 0 ? "bg-white" : "bg-gray-50",
          isExpanded ? "border-b-0" : "",
          "cursor-pointer hover:bg-zap-blue"
        )} 
        style={{ transition: 'none' }}
        onClick={() => toggleRow(index)}
      >
        <TableCell className="font-medium">
          <div className="flex items-center w-full">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            )}
            <span className="text-sm sm:text-base font-medium">{feature.name}</span>
          </div>
        </TableCell>
        <FeatureCell 
          value={feature.signatureArtist} 
          hasDiscount={feature.hasDiscount}
          type="signatureArtist" 
          stackText={needsStacking}
        />
      </TableRow>
      
      {/* Expanded content - no hover effect */}
      {isExpanded && feature.description && (
        <TableRow 
          className={cn(index % 2 === 0 ? "bg-white" : "bg-gray-50")} 
          style={{ transition: 'none' }}
        >
          <TableCell colSpan={2} className="p-2 pt-0 sm:p-4 sm:pt-0">
            <div className="text-black text-base sm:text-lg pl-1 sm:pl-4 pb-1">
              {feature.description}
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default FeatureRow;

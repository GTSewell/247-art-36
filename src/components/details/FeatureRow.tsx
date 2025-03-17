
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

const FeatureRow = ({ feature, index, isExpanded, toggleRow }: FeatureRowProps) => {
  return (
    <React.Fragment>
      <TableRow 
        className={cn(
          index % 2 === 0 ? "bg-white" : "bg-gray-50",
          isExpanded ? "border-b-0" : ""
        )} 
        style={{ transition: 'none' }}
      >
        <TableCell className="font-medium">
          <div 
            className="flex items-center justify-between w-full cursor-pointer"
            onClick={() => toggleRow(index)}
          >
            <span>{feature.name}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </TableCell>
        <FeatureCell value={feature.studioArtist} />
        <FeatureCell value={feature.featureArtist} />
      </TableRow>
      
      {/* Expanded content */}
      {isExpanded && feature.description && (
        <TableRow 
          className={cn(index % 2 === 0 ? "bg-white" : "bg-gray-50")} 
          style={{ transition: 'none' }}
        >
          <TableCell colSpan={3} className="p-4 pt-0">
            <div className="text-gray-600 text-sm italic pl-4 pb-2">
              {feature.description}
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default FeatureRow;

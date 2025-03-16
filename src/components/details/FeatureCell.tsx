
import React from "react";
import { Check, X } from "lucide-react";
import { TableCell } from "@/components/ui/table";

interface FeatureCellProps {
  value: boolean | string;
}

const FeatureCell = ({ value }: FeatureCellProps) => {
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

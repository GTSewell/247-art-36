
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";

const TableFooterComponent = () => {
  return (
    <TableRow className="bg-black hover:bg-black border-t-2 border-gray-700" style={{ transition: 'none' }}>
      <TableCell className="font-bold text-white py-2 sm:py-4">
        <span className="text-sm sm:text-lg flex items-center">
          Secure your spot now ... <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </TableCell>
      <TableCell className="text-center py-2 sm:py-4">
        <a 
          href="https://print.oshi.id/products/studio?_pos=1&_psq=studio&_ss=e&_v=1.0" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            className="bg-zap-yellow text-black hover:bg-zap-yellow/80 transition-colors w-full sm:w-auto justify-center"
            size="sm"
          >
            <ShoppingCart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Studio</span>
          </Button>
        </a>
      </TableCell>
      <TableCell className="text-center py-2 sm:py-4">
        <a 
          href="https://print.oshi.id/products/feature-247-art-exhibition?_pos=1&_psq=feat&_ss=e&_v=1.0" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            className="bg-zap-red text-white hover:bg-zap-red/80 transition-colors w-full sm:w-auto justify-center"
            size="sm"
          >
            <ShoppingCart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Feature</span>
          </Button>
        </a>
      </TableCell>
    </TableRow>
  );
};

export default TableFooterComponent;

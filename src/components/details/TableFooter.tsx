
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const TableFooterComponent = () => {
  return (
    <TableRow className="bg-black hover:bg-black border-t-2 border-gray-700" style={{ transition: 'none' }}>
      <TableCell className="font-bold text-white py-2 sm:py-4">
        <span className="text-xs sm:text-lg">Secure your spot...</span>
      </TableCell>
      <TableCell className="text-center py-2 sm:py-4">
        <Button 
          className="bg-zap-yellow text-black hover:bg-zap-yellow/80 transition-colors w-full sm:w-auto justify-center"
          size="sm"
        >
          <ShoppingCart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs">Studio</span>
        </Button>
      </TableCell>
      <TableCell className="text-center py-2 sm:py-4">
        <Button 
          className="bg-zap-red text-white hover:bg-zap-red/80 transition-colors w-full sm:w-auto justify-center"
          size="sm"
        >
          <ShoppingCart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs">Feature</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableFooterComponent;

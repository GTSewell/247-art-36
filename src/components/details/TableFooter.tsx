
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const TableFooterComponent = () => {
  return (
    <TableRow className="bg-black hover:bg-black border-t-2 border-gray-700" style={{ transition: 'none' }}>
      <TableCell className="font-bold text-lg py-4 text-white">Secure your spot</TableCell>
      <TableCell className="text-center py-4">
        <Button 
          className="bg-zap-yellow text-black hover:bg-zap-yellow/80 transition-colors"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Purchase
        </Button>
      </TableCell>
      <TableCell className="text-center py-4">
        <Button 
          className="bg-zap-red text-white hover:bg-zap-red/80 transition-colors"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Purchase
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableFooterComponent;


import React, { useRef } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const TableFooterComponent = () => {
  const rowRef = useRef<HTMLTableRowElement>(null);

  return (
    <>
      <TableRow ref={rowRef} className="bg-black hover:bg-black text-white" style={{
        transition: 'none'
      }}>
        <TableCell>
          <span className="text-white text-xs font-extrabold sm:text-lg">Secure your 'Signature Artist' spot here ... 👉</span>
        </TableCell>
        <TableCell className="text-center p-1">
          <a href="https://print.oshi.id/products/feature-247-art-exhibition" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="text-xs max-w-[180px] mx-auto w-full text-white hover:text-black font-medium px-0 py-0 text-center rounded sm:text-lg bg-zap-red">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Art
            </Button>
          </a>
        </TableCell>
      </TableRow>
      <TableRow className="bg-zap-green text-center hover:bg-zap-green border-0">
        <TableCell colSpan={2} className="text-xs text-white italic p-2 font-medium">
          *We also accept payment in Ethereum and USDT/C. Please contact us directly for more information.
        </TableCell>
      </TableRow>
    </>
  );
};

export default TableFooterComponent;


import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
const TableFooterComponent = () => {
  return <TableRow className="bg-black hover:bg-black text-white" style={{
    transition: 'none'
  }}>
      <TableCell>
        <span className="text-white text-xs font-extrabold sm:text-lg">Secure your spot ... 👉</span>
      </TableCell>
      <TableCell className="text-center p-1">
        <Link to="/artist-submission">
          <Button size="sm" className="text-xs sm:text-sm w-full bg-[#ea384c] text-white hover:bg-[#ea384c]/90 font-medium">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Signature Artist
          </Button>
        </Link>
      </TableCell>
    </TableRow>;
};
export default TableFooterComponent;

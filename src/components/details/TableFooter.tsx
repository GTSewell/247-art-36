
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TableFooterComponent = () => {
  return (
    <TableRow className="bg-black hover:bg-black text-white" style={{ transition: 'none' }}>
      <TableCell>
        <span className="text-white text-xs sm:text-sm">
          Select a package to join our exhibition
        </span>
      </TableCell>
      <TableCell className="text-center p-1">
        <Link to="/artist-submission">
          <Button size="sm" variant="secondary" className="text-xs sm:text-sm w-full">
            Select Studio
            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </Link>
      </TableCell>
      <TableCell className="text-center p-1">
        <Link to="/artist-submission">
          <Button size="sm" variant="secondary" className="text-xs sm:text-sm w-full">
            Select Feature
            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </Link>
      </TableCell>
      <TableCell className="text-center p-1">
        <Link to="/artist-submission">
          <Button size="sm" variant="secondary" className="text-xs sm:text-sm w-full">
            Select Signature
            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default TableFooterComponent;

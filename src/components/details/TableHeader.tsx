
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TableHeaderComponent = () => {
  return (
    <TableHeader>
      <TableRow className="bg-black hover:bg-black" style={{ transition: 'none' }}>
        <TableHead className="text-white">Features</TableHead>
        <TableHead className="text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-lg text-zap-yellow">Studio Artist</span>
          </div>
        </TableHead>
        <TableHead className="text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-lg text-zap-red">Feature Artist</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TableHeaderComponent;

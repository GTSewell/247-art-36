import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
const TableHeaderComponent = () => {
  return <TableHeader>
      <TableRow className="bg-black hover:bg-black" style={{
      transition: 'none'
    }}>
        <TableHead className="font-bold text-lg text-white p-1">
          <span className="text-[0.85rem] text-[#ffcf02] px-[21px] sm:text-lg">Features: Click feature for info</span>
        </TableHead>
        <TableHead className="text-center p-1">
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-[0.85rem] sm:text-lg text-zap-yellow">Studio</span>
          </div>
        </TableHead>
        <TableHead className="text-center p-1">
          <div className="flex flex-col items-center justify-center">
            <span className="font-bold text-[0.85rem] sm:text-lg text-zap-red">Feature</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>;
};
export default TableHeaderComponent;
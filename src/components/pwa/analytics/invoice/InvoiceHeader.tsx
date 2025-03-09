
import React from "react";
import { Avatar } from "@/components/ui/avatar";

interface InvoiceHeaderProps {
  invoiceNumber: string;
  formattedDate: string;
  artistName: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceNumber, formattedDate, artistName }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium">N. INVOICE</p>
        <p className="font-bold">{invoiceNumber}</p>
        <p className="font-medium mt-2">DATE</p>
        <p>{formattedDate}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Avatar className="h-12 w-12">
          <div className="bg-muted rounded-full w-full h-full flex items-center justify-center">
            <span className="text-lg font-medium">
              {artistName.charAt(0)}
            </span>
          </div>
        </Avatar>
        <div>
          <p className="font-bold">{artistName}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;

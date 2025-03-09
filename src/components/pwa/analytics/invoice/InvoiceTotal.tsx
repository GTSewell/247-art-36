
import React from "react";

interface InvoiceTotalProps {
  totalAmount: number;
}

const InvoiceTotal: React.FC<InvoiceTotalProps> = ({ totalAmount }) => {
  return (
    <div className="flex justify-end mt-4">
      <div className="w-full sm:w-1/3">
        <div className="flex justify-between py-2 border-t">
          <span className="font-semibold">TOTAL OWING:</span>
          <span className="font-bold">${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotal;


import React from "react";

interface LineItem {
  quantity: number;
  title: string;
  type: string;
  unitPrice: number;
}

interface LineItemsProps {
  lineItems: LineItem[];
}

const LineItems: React.FC<LineItemsProps> = ({ lineItems }) => {
  return (
    <div className="border rounded-md overflow-hidden mt-8">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left py-2 px-2 font-semibold">QTY</th>
            <th className="text-left py-2 px-2 font-semibold">Title</th>
            <th className="text-left py-2 px-2 font-semibold">Type</th>
            <th className="text-right py-2 px-2 font-semibold">Unit $</th>
            <th className="text-right py-2 px-2 font-semibold">Total $</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-2">{item.quantity}</td>
              <td className="py-2 px-2">{item.title}</td>
              <td className="py-2 px-2">{item.type}</td>
              <td className="py-2 px-2 text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="py-2 px-2 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LineItems;

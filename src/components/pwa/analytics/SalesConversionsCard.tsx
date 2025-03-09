
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const SalesConversionsCard: React.FC = () => {
  const salesData = [
    { source: "247.art", sales: 12, conversion: "18.5%" },
    { source: "Instagram", sales: 18, conversion: "17.6%" },
    { source: "Facebook", sales: 3, conversion: "20.0%" },
    { source: "X", sales: 0, conversion: "0.0%" },
    { source: "Other", sales: 2, conversion: "12.5%" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Sales Conversions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold">Source</th>
                <th className="text-right py-2 font-semibold">Sales</th>
                <th className="text-right py-2 font-semibold">Conversion %</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3 font-medium">{item.source}</td>
                  <td className="py-3 text-right">{item.sales}</td>
                  <td className="py-3 text-right">{item.conversion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesConversionsCard;

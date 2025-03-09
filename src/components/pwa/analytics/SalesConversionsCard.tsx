
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const SalesConversionsCard: React.FC = () => {
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
              <tr>
                <th className="text-left font-semibold pb-2">Source</th>
                <th className="text-center font-semibold pb-2">247.art</th>
                <th className="text-center font-semibold pb-2">Instagram</th>
                <th className="text-center font-semibold pb-2">Facebook</th>
                <th className="text-center font-semibold pb-2">X</th>
                <th className="text-center font-semibold pb-2">Other</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold py-2">Sales</td>
                <td className="text-center py-2">12</td>
                <td className="text-center py-2">18</td>
                <td className="text-center py-2">3</td>
                <td className="text-center py-2">0</td>
                <td className="text-center py-2">2</td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Conversion %</td>
                <td className="text-center py-2">18.5%</td>
                <td className="text-center py-2">17.6%</td>
                <td className="text-center py-2">20.0%</td>
                <td className="text-center py-2">0.0%</td>
                <td className="text-center py-2">12.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesConversionsCard;


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

interface SalesBreakdownCardProps {
  demoMode?: boolean;
}

const SalesBreakdownCard: React.FC<SalesBreakdownCardProps> = ({ demoMode }) => {
  // Demo data with more realistic values
  const data = demoMode ? [
    { name: "Prints", value: 45, color: "#FF5733" },
    { name: "Originals", value: 30, color: "#33FF57" },
    { name: "Digital Art", value: 15, color: "#3357FF" },
    { name: "Merchandise", value: 10, color: "#F3FF33" }
  ] : [
    { name: "Prints", value: 65, color: "#FF5733" },
    { name: "Originals", value: 15, color: "#33FF57" },
    { name: "Digital Art", value: 15, color: "#3357FF" },
    { name: "Merchandise", value: 5, color: "#F3FF33" }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Sales Breakdown</CardTitle>
        <CardDescription>
          Your sales by product type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesBreakdownCard;

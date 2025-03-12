
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesAnalyticsCardProps {
  demoMode?: boolean;
}

const SalesAnalyticsCard: React.FC<SalesAnalyticsCardProps> = ({ demoMode }) => {
  // Demo data with more realistic values and trends
  const data = demoMode ? [
    { month: "Jan", sales: 2400, orders: 24 },
    { month: "Feb", sales: 1398, orders: 13 },
    { month: "Mar", sales: 9800, orders: 98 },
    { month: "Apr", sales: 3908, orders: 39 },
    { month: "May", sales: 4800, orders: 48 },
    { month: "Jun", sales: 3800, orders: 38 },
    { month: "Jul", sales: 4300, orders: 43 }
  ] : [
    { month: "Jan", sales: 900, orders: 9 },
    { month: "Feb", sales: 1200, orders: 12 },
    { month: "Mar", sales: 1100, orders: 11 },
    { month: "Apr", sales: 1300, orders: 13 },
    { month: "May", sales: 800, orders: 8 },
    { month: "Jun", sales: 1600, orders: 16 },
    { month: "Jul", sales: 1750, orders: 17 }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Sales Analytics</CardTitle>
        <CardDescription>
          Your sales over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesAnalyticsCard;

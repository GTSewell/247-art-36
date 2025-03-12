
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesConversionsCardProps {
  demoMode?: boolean;
}

const SalesConversionsCard: React.FC<SalesConversionsCardProps> = ({ demoMode }) => {
  // Demo data with more realistic values
  const data = demoMode ? [
    { date: "Jan 1", rate: 25 },
    { date: "Jan 15", rate: 30 },
    { date: "Feb 1", rate: 28 },
    { date: "Feb 15", rate: 32 },
    { date: "Mar 1", rate: 38 },
    { date: "Mar 15", rate: 42 },
    { date: "Apr 1", rate: 45 }
  ] : [
    { date: "Jan 1", rate: 5 },
    { date: "Jan 15", rate: 10 },
    { date: "Feb 1", rate: 8 },
    { date: "Feb 15", rate: 12 },
    { date: "Mar 1", rate: 18 },
    { date: "Mar 15", rate: 22 },
    { date: "Apr 1", rate: 25 }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">View to Purchase Conversion</CardTitle>
        <CardDescription>
          Percentage of profile views that result in a purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
              <Line type="monotone" dataKey="rate" stroke="#FF5733" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesConversionsCard;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartDataPoint {
  name: string;
  sales: number;
  revenue: number;
}

interface SalesChartProps {
  data: ChartDataPoint[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Sales Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                name="Units Sold"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;

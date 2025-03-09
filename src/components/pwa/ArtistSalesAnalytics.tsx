
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Award } from "lucide-react";

interface ArtistSalesAnalyticsProps {
  artistId: string | null;
}

const ArtistSalesAnalytics: React.FC<ArtistSalesAnalyticsProps> = ({ artistId }) => {
  // Sample data for the chart
  const data = [
    {
      name: "Jan",
      sales: 4000,
      revenue: 2400,
    },
    {
      name: "Feb",
      sales: 3000,
      revenue: 1398,
    },
    {
      name: "Mar",
      sales: 2000,
      revenue: 9800,
    },
    {
      name: "Apr",
      sales: 2780,
      revenue: 3908,
    },
    {
      name: "May",
      sales: 1890,
      revenue: 4800,
    },
    {
      name: "Jun",
      sales: 2390,
      revenue: 3800,
    },
  ];

  // Example stats for demonstration
  const totalRevenue = "$24,106";
  const totalUnitsSold = "16,060";
  const mostPopularItem = "Abstract Series #1";

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base font-medium text-white">
              <DollarSign className="mr-2 h-4 w-4 text-zap-red" />
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{totalRevenue}</p>
            <p className="text-xs text-zinc-400">Last 6 months</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base font-medium text-white">
              <ShoppingBag className="mr-2 h-4 w-4 text-zap-blue" />
              Total Units Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{totalUnitsSold}</p>
            <p className="text-xs text-zinc-400">Last 6 months</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base font-medium text-white">
              <Award className="mr-2 h-4 w-4 text-yellow-500" />
              Most Popular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-white truncate">{mostPopularItem}</p>
            <p className="text-xs text-zinc-400">Highest selling artwork</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
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
    </div>
  );
};

export default ArtistSalesAnalytics;

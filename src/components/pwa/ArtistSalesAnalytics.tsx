
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Award, Palette, Printer, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Client-requested stats
  const totalRevenue = "$3,420";
  const popularItems = [
    { name: "Abstract 1 Fine art print", count: 20 },
    { name: "Abstract 1 T-shirt", count: 8 },
    { name: "Abstract 2 Art Poster", count: 5 },
  ];

  const handleGenerateInvoice = () => {
    console.log("Generate and send invoice for artist ID:", artistId);
    // This will be implemented later to connect with the invoice generation functionality
  };

  return (
    <div className="space-y-2">
      {/* Original Art */}
      <Card className="bg-black border-zinc-800">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="flex items-center text-base font-medium text-white">
            <Palette className="mr-2 h-4 w-4 text-purple-500" />
            Original Art
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-zinc-400">Sales:</p>
              <p className="text-xl font-bold text-white">$2,650</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Units:</p>
              <p className="text-xl font-bold text-white">2</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prints */}
      <Card className="bg-black border-zinc-800">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="flex items-center text-base font-medium text-white">
            <Printer className="mr-2 h-4 w-4 text-blue-400" />
            Print
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-zinc-400">Sales:</p>
              <p className="text-xl font-bold text-white">$770</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Units:</p>
              <p className="text-xl font-bold text-white">33</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Sales */}
      <Card className="bg-black border-zinc-800">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="flex items-center text-base font-medium text-white">
            <DollarSign className="mr-2 h-4 w-4 text-green-500" />
            Total Sales
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <p className="text-2xl font-bold text-white">{totalRevenue}</p>
        </CardContent>
      </Card>

      {/* Most Popular */}
      <Card className="bg-black border-zinc-800">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="flex items-center text-base font-medium text-white">
            <Award className="mr-2 h-4 w-4 text-yellow-500" />
            Most Popular
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3 space-y-1">
          {popularItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-white font-medium mr-2">{index + 1}.</span>
              <span className="text-white">{item.name}</span>
              <span className="text-zinc-400 text-sm ml-1">[{item.count}]</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* STP Sets */}
      <Card className="bg-black border-zinc-800">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="flex items-center text-base font-medium text-white">
            <CheckCircle2 className="mr-2 h-4 w-4 text-zap-red" />
            STP Sets
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-zinc-400">Stickers</p>
              <p className="text-xl font-bold text-white">3</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">T-shirts</p>
              <p className="text-xl font-bold text-white">8</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Prints</p>
              <p className="text-xl font-bold text-white">20</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
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

      {/* Generate & Send Invoice Button */}
      <div className="mt-4">
        <Button 
          onClick={handleGenerateInvoice} 
          className="w-full bg-zap-red hover:bg-zap-blue"
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate & Send Invoice
        </Button>
      </div>
    </div>
  );
};

export default ArtistSalesAnalytics;

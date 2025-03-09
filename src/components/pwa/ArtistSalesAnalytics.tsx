import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, ShoppingBag, Eye, BarChart3 } from "lucide-react";
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

  return (
    <div className="space-y-6">
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
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Sales Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Original Art</h3>
                <div className="flex justify-between mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-xl font-bold">$2,650</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Units</p>
                    <p className="text-xl font-bold">2</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Print</h3>
                <div className="flex justify-between mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-xl font-bold">$770</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Units</p>
                    <p className="text-xl font-bold">33</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-2xl font-bold mt-1">$3,420</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Most Popular</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li className="text-sm">Abstract 1 Fine art print <span className="font-semibold">[20]</span></li>
                <li className="text-sm">Abstract 1 T-shirt <span className="font-semibold">[8]</span></li>
                <li className="text-sm">Abstract 2 Art Poster <span className="font-semibold">[5]</span></li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            STP Sets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-lg font-semibold">Stickers</h3>
              <p className="text-2xl font-bold mt-1">3</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">T-shirts</h3>
              <p className="text-2xl font-bold mt-1">8</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Prints</h3>
              <p className="text-2xl font-bold mt-1">20</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Profile Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            <div>
              <h3 className="text-sm font-semibold">247.art</h3>
              <p className="text-xl font-bold mt-1">64</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Instagram</h3>
              <p className="text-xl font-bold mt-1">102</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Facebook</h3>
              <p className="text-xl font-bold mt-1">15</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">X</h3>
              <p className="text-xl font-bold mt-1">3</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Other</h3>
              <p className="text-xl font-bold mt-1">16</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button className="w-full md:w-auto">Export Analytics Report</Button>
        <Button className="w-full md:w-auto" variant="secondary">Generate & Send Invoice</Button>
      </div>
    </div>
  );
};

export default ArtistSalesAnalytics;

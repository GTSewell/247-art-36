
import React from "react";
import { Palette, Printer } from "lucide-react";
import SalesMetricsCard from "./analytics/SalesMetricsCard";
import TotalSalesCard from "./analytics/TotalSalesCard";
import PopularItemsCard from "./analytics/PopularItemsCard";
import STPSetsCard from "./analytics/STPSetsCard";
import SalesChart from "./analytics/SalesChart";
import GenerateInvoiceButton from "./analytics/GenerateInvoiceButton";

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

  const handleGenerateInvoice = (artistId: string | null) => {
    console.log("Generate and send invoice for artist ID:", artistId);
    // This will be implemented later to connect with the invoice generation functionality
  };

  return (
    <div className="space-y-2">
      {/* Original Art */}
      <SalesMetricsCard
        title="Original Art"
        icon={Palette}
        iconColor="text-purple-500"
        sales="$2,650"
        units={2}
      />

      {/* Prints */}
      <SalesMetricsCard
        title="Print"
        icon={Printer}
        iconColor="text-blue-400"
        sales="$770"
        units={33}
      />

      {/* Total Sales */}
      <TotalSalesCard totalRevenue={totalRevenue} />

      {/* Most Popular */}
      <PopularItemsCard items={popularItems} />

      {/* STP Sets */}
      <STPSetsCard stickers={3} tshirts={8} prints={20} />

      {/* Chart */}
      <SalesChart data={data} />

      {/* Generate & Send Invoice Button */}
      <GenerateInvoiceButton artistId={artistId} onGenerate={handleGenerateInvoice} />
    </div>
  );
};

export default ArtistSalesAnalytics;

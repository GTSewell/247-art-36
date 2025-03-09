
import React from "react";
import AnalyticsCard from "./AnalyticsCard";
import { DollarSign } from "lucide-react";

interface TotalSalesCardProps {
  totalRevenue: string;
}

const TotalSalesCard: React.FC<TotalSalesCardProps> = ({ totalRevenue }) => {
  return (
    <AnalyticsCard
      title="Total Sales"
      icon={DollarSign}
      iconColor="text-green-500"
    >
      <p className="text-2xl font-bold text-white">{totalRevenue}</p>
    </AnalyticsCard>
  );
};

export default TotalSalesCard;

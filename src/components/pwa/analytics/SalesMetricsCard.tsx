
import React from "react";
import AnalyticsCard from "./AnalyticsCard";
import { LucideIcon } from "lucide-react";

interface SalesMetricsCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  sales: string;
  units: number;
}

const SalesMetricsCard: React.FC<SalesMetricsCardProps> = ({
  title,
  icon,
  iconColor,
  sales,
  units,
}) => {
  return (
    <AnalyticsCard title={title} icon={icon} iconColor={iconColor}>
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-zinc-400">Sales:</p>
          <p className="text-xl font-bold text-white">{sales}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400">Units:</p>
          <p className="text-xl font-bold text-white">{units}</p>
        </div>
      </div>
    </AnalyticsCard>
  );
};

export default SalesMetricsCard;

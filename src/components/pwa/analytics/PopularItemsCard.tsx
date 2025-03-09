
import React from "react";
import AnalyticsCard from "./AnalyticsCard";
import { Award } from "lucide-react";

interface PopularItem {
  name: string;
  count: number;
}

interface PopularItemsCardProps {
  items: PopularItem[];
}

const PopularItemsCard: React.FC<PopularItemsCardProps> = ({ items }) => {
  return (
    <AnalyticsCard
      title="Most Popular"
      icon={Award}
      iconColor="text-yellow-500"
    >
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="text-white font-medium mr-2">{index + 1}.</span>
            <span className="text-white">{item.name}</span>
            <span className="text-zinc-400 text-sm ml-1">[{item.count}]</span>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
};

export default PopularItemsCard;

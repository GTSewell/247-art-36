
import React from "react";
import AnalyticsCard from "./AnalyticsCard";
import { CheckCircle2 } from "lucide-react";

interface STPSetsCardProps {
  stickers: number;
  tshirts: number;
  prints: number;
}

const STPSetsCard: React.FC<STPSetsCardProps> = ({ stickers, tshirts, prints }) => {
  return (
    <AnalyticsCard
      title="STP Sets"
      icon={CheckCircle2}
      iconColor="text-zap-red"
    >
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-zinc-400">Stickers</p>
          <p className="text-xl font-bold text-white">{stickers}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400">T-shirts</p>
          <p className="text-xl font-bold text-white">{tshirts}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400">Prints</p>
          <p className="text-xl font-bold text-white">{prints}</p>
        </div>
      </div>
    </AnalyticsCard>
  );
};

export default STPSetsCard;

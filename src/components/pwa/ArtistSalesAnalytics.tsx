
import React from "react";
import SalesBreakdownCard from "./analytics/SalesBreakdownCard";
import SalesAnalyticsCard from "./analytics/SalesAnalyticsCard";
import STPSetsCard from "./analytics/STPSetsCard";
import ProfileViewsCard from "./analytics/ProfileViewsCard";
import SalesConversionsCard from "./analytics/SalesConversionsCard";
import ActionButtons from "./analytics/ActionButtons";

interface ArtistSalesAnalyticsProps {
  artistId: string | null;
}

const ArtistSalesAnalytics: React.FC<ArtistSalesAnalyticsProps> = ({ artistId }) => {
  return (
    <div className="space-y-6">
      <STPSetsCard />
      <SalesBreakdownCard />
      <SalesAnalyticsCard />
      <ProfileViewsCard />
      <SalesConversionsCard />
      <ActionButtons />
    </div>
  );
};

export default ArtistSalesAnalytics;

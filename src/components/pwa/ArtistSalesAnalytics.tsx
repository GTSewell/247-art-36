
import React from "react";
import SalesBreakdownCard from "./analytics/SalesBreakdownCard";
import SalesAnalyticsCard from "./analytics/SalesAnalyticsCard";
import ProfileViewsCard from "./analytics/ProfileViewsCard";
import SalesConversionsCard from "./analytics/SalesConversionsCard";
import MyCollectorsCard from "./analytics/MyCollectorsCard";
import ActionButtons from "./analytics/ActionButtons";
// STPSetsCard import is kept but not used for now

interface ArtistSalesAnalyticsProps {
  artistId: string | null;
}

const ArtistSalesAnalytics: React.FC<ArtistSalesAnalyticsProps> = ({ artistId }) => {
  return (
    <div className="space-y-6">
      {/* STPSetsCard temporarily hidden
      <STPSetsCard /> */}
      <MyCollectorsCard />
      <SalesBreakdownCard />
      <SalesAnalyticsCard />
      <ProfileViewsCard />
      <SalesConversionsCard />
      <ActionButtons />
    </div>
  );
};

export default ArtistSalesAnalytics;

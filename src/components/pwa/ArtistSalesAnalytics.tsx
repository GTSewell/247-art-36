
import React from "react";
import SalesBreakdownCard from "./analytics/SalesBreakdownCard";
import SalesAnalyticsCard from "./analytics/SalesAnalyticsCard";
import STPSetsCard from "./analytics/STPSetsCard";
import ProfileViewsCard from "./analytics/ProfileViewsCard";
import SalesConversionsCard from "./analytics/SalesConversionsCard";
import MyCollectorsCard from "./analytics/MyCollectorsCard";
import ActionButtons from "./analytics/ActionButtons";
import { toast } from "sonner";

interface ArtistSalesAnalyticsProps {
  artistId: string | null;
}

const ArtistSalesAnalytics: React.FC<ArtistSalesAnalyticsProps> = ({ artistId }) => {
  // Disable actions in demo mode
  const demoMode = localStorage.getItem('demoSession') === 'active';
  const handleDemoAction = () => {
    if (demoMode) {
      toast.info('This action is disabled in the demo account');
      return true;
    }
    return false;
  };
  
  return (
    <div className="space-y-6">
      <STPSetsCard onAction={handleDemoAction} />
      <MyCollectorsCard onAction={handleDemoAction} />
      <SalesBreakdownCard />
      <SalesAnalyticsCard />
      <ProfileViewsCard />
      <SalesConversionsCard />
      <ActionButtons onAction={handleDemoAction} />
    </div>
  );
};

export default ArtistSalesAnalytics;

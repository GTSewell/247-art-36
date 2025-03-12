
import React, { useEffect, useState } from "react";
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

// Mock data for the demo account
const DEMO_STP_DATA = {
  completionPercentage: 85,
  packCount: 2,
  productCount: 12,
  nextAction: "Add a new limited edition"
};

const ArtistSalesAnalytics: React.FC<ArtistSalesAnalyticsProps> = ({ artistId }) => {
  const [demoMode] = useState(localStorage.getItem('demoSession') === 'active');
  
  // This function will handle demo actions - it will show toasts but allow interactions
  const handleDemoAction = (actionName?: string) => {
    if (demoMode) {
      toast.info(`Demo mode: ${actionName || 'Action'} would be performed in live mode`);
      return false; // Return false to allow the action to continue
    }
    return false;
  };
  
  return (
    <div className="space-y-6">
      <STPSetsCard 
        onAction={handleDemoAction} 
        demoMode={demoMode}
        demoData={DEMO_STP_DATA}
      />
      <MyCollectorsCard onAction={handleDemoAction} />
      <SalesBreakdownCard demoMode={demoMode} />
      <SalesAnalyticsCard demoMode={demoMode} />
      <ProfileViewsCard demoMode={demoMode} />
      <SalesConversionsCard demoMode={demoMode} />
      <ActionButtons onAction={handleDemoAction} />
    </div>
  );
};

export default ArtistSalesAnalytics;

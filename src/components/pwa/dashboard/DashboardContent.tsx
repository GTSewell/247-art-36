import React from "react";
import LinksManager from "./sections/LinksManager";
import OverviewSection from "./sections/OverviewSection";
import AppearanceSection from "./sections/AppearanceSection";
import AnalyticsSection from "./sections/AnalyticsSection";
import SettingsSection from "./sections/SettingsSection";
import AssignedProductsSection from "./sections/AssignedProductsSection";

type DashboardSection = "overview" | "links" | "appearance" | "analytics" | "settings" | "products";

interface DashboardContentProps {
  activeSection: DashboardSection;
  artistId: string | null;
  isDemo: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeSection,
  artistId,
  isDemo
}) => {
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection artistId={artistId} isDemo={isDemo} />;
      case "products":
        return <AssignedProductsSection artistId={artistId} isDemo={isDemo} />;
      case "links":
        return <LinksManager artistId={artistId} isDemo={isDemo} />;
      case "appearance":
        return <AppearanceSection artistId={artistId} isDemo={isDemo} />;
      case "analytics":
        return <AnalyticsSection artistId={artistId} isDemo={isDemo} />;
      case "settings":
        return <SettingsSection artistId={artistId} isDemo={isDemo} />;
      default:
        return <LinksManager artistId={artistId} isDemo={isDemo} />;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderSection()}
    </div>
  );
};

export default DashboardContent;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/navigation/Navigation";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useAppMode } from "@/contexts/AppModeContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardContent from "./DashboardContent";
import LivePreviewPanel from "./LivePreviewPanel";

type DashboardSection = "overview" | "links" | "appearance" | "analytics" | "settings";

interface LinktreeDashboardProps {
  artistId: string | null;
}

const LinktreeDashboard: React.FC<LinktreeDashboardProps> = ({ artistId }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>("links");
  const { user, isLoading } = useAuth();
  const { isPWA } = useAppMode();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-xl text-foreground mb-4">Please sign in to access your artist dashboard</p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const isDemo = user.email?.includes('demo') || user.email?.includes('247art');

  return (
    <div className="min-h-screen bg-background">
      {isPWA ? <PWANavigation /> : <Navigation />}
      
      {/* Main Dashboard Layout */}
      <div className="flex h-screen pt-16">
        {/* Left Sidebar */}
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onBack={() => navigate('/account')}
          isPWA={isPWA}
          isDemo={isDemo}
        />
        
        {/* Main Content Area - Split Screen */}
        <div className="flex-1 flex min-w-0">
          {/* Edit Panel */}
          <div className="flex-1 border-r border-border">
            <DashboardContent
              activeSection={activeSection}
              artistId={artistId}
              isDemo={isDemo}
            />
          </div>
          
          {/* Live Preview Panel */}
          <div className="w-80 xl:w-96 bg-muted/30">
            <LivePreviewPanel
              artistId={artistId}
              activeSection={activeSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinktreeDashboard;
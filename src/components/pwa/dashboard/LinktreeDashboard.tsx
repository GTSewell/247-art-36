import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/navigation/Navigation";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useAppMode } from "@/contexts/AppModeContext";
import ResponsiveDashboardLayout from "./ResponsiveDashboardLayout";

type DashboardSection = "overview" | "links" | "appearance" | "analytics" | "settings" | "products";

interface LinktreeDashboardProps {
  artistId: string | null;
}

const LinktreeDashboard: React.FC<LinktreeDashboardProps> = ({ artistId }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
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
      
      {/* Responsive Dashboard Layout */}
      <ResponsiveDashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        artistId={artistId}
        isPWA={isPWA}
        isDemo={isDemo}
        onBack={() => navigate('/account')}
      />
    </div>
  );
};

export default LinktreeDashboard;
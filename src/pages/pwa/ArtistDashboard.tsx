
import React, { useState } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtistProfileSettings from "@/components/pwa/ArtistProfileSettings";
import ArtistArtworkManager from "@/components/pwa/ArtistArtworkManager";
import ArtistSalesAnalytics from "@/components/pwa/ArtistSalesAnalytics";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";

type TabType = "profile" | "artworks" | "analytics";

const ArtistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const { user, isLoading } = useAuth();
  const { isPWA } = useAppMode();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="container mx-auto px-4 pt-20 pb-20">
          <div className="animate-pulse">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="container mx-auto px-4 pt-20 pb-20 flex flex-col items-center justify-center">
          <p className="text-xl text-white mb-4">Please sign in to access your artist dashboard</p>
          <Button 
            onClick={() => window.location.href = "/auth"}
            className="bg-zap-red hover:bg-zap-blue"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Use user.id directly as the artistId
  const artistId = user?.id || null;

  return (
    <div className="min-h-screen bg-black">
      {isPWA ? <PWANavigation /> : <Navigation />}
      <div className="container mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold text-white mb-6">Artist Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="space-y-4">
          <TabsList className="grid grid-cols-3 h-14 sticky top-0 z-10 bg-black">
            <TabsTrigger value="profile" className="text-sm">Profile</TabsTrigger>
            <TabsTrigger value="artworks" className="text-sm">Artworks</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          </TabsList>
          
          <div className={`dashboard-content ${isPWA ? 'overflow-y-auto' : ''}`}>
            <TabsContent value="profile" className="space-y-4 pb-20">
              <ArtistProfileSettings artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="artworks" className="space-y-4 pb-20">
              <ArtistArtworkManager artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4 pb-20">
              <ArtistSalesAnalytics artistId={artistId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtistDashboard;

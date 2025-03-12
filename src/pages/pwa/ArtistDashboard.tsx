
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtistProfileSettings from "@/components/pwa/ArtistProfileSettings";
import ArtistArtworkManager from "@/components/pwa/ArtistArtworkManager";
import ArtistSalesAnalytics from "@/components/pwa/ArtistSalesAnalytics";
import ArtistTradeManager from "@/components/pwa/ArtistTradeManager"; // New component
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";

type TabType = "profile" | "artworks" | "trade" | "analytics"; // Added "trade" tab type

const ArtistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const { user, isLoading } = useAuth();
  const { isPWA } = useAppMode();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse the query parameter to set the initial tab
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab === "artworks" || tab === "analytics" || tab === "trade") {
      setActiveTab(tab as TabType);
    }
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="container mx-auto px-4 pt-16 pb-20">
          <div className="animate-pulse text-white">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="container mx-auto px-4 pt-16 pb-20 flex flex-col items-center justify-center">
          <p className="text-xl text-white mb-4">Please sign in to access your artist dashboard</p>
          <Button 
            onClick={() => navigate('/auth')}
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
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="flex items-center mb-6">
          {isPWA && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2 -ml-2 text-white" 
              onClick={() => navigate('/account')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-bold text-white">Artist Dashboard</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="space-y-4">
          <TabsList className="grid grid-cols-4 h-14 sticky top-0 z-10 bg-black"> {/* Changed from grid-cols-3 to grid-cols-4 */}
            <TabsTrigger value="profile" className="text-sm">Profile</TabsTrigger>
            <TabsTrigger value="artworks" className="text-sm">Artworks</TabsTrigger>
            <TabsTrigger value="trade" className="text-sm">Trade</TabsTrigger> {/* New tab */}
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          </TabsList>
          
          <div className={`dashboard-content ${isPWA ? 'overflow-y-auto' : ''}`}>
            <TabsContent value="profile" className="space-y-4 pb-20">
              <ArtistProfileSettings artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="artworks" className="space-y-4 pb-20">
              <ArtistArtworkManager artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="trade" className="space-y-4 pb-20">
              <ArtistTradeManager artistId={artistId} />
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

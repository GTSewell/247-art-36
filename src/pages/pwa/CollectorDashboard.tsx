
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import PWANavigation from "@/components/pwa/PWANavigation";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CollectorFavorites from "@/components/pwa/CollectorFavorites";
import CollectorPurchases from "@/components/pwa/CollectorPurchases";
import CollectorSettings from "@/components/pwa/CollectorSettings";

const CollectorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const { isPWA } = useAppMode();
  const [activeTab, setActiveTab] = useState("favorites");
  
  useEffect(() => {
    // Parse the query parameter to set the initial tab
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab === "purchases" || tab === "settings") {
      setActiveTab(tab);
    }
  }, [location.search]);
  
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please sign in to access the collector dashboard");
      navigate('/auth');
    } else if (user) {
      setLoading(false);
    }
  }, [user, isLoading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="container mx-auto px-4 pt-16 pb-20 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {isPWA ? <PWANavigation /> : <Navigation />}
      
      <main className="container max-w-4xl mx-auto px-4 pt-20 pb-24">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-3 -ml-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Collector Dashboard</h1>
        </div>
        
        {/* Clean minimal tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-muted/50">
            <TabsTrigger value="favorites" className="text-sm font-medium">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="purchases" className="text-sm font-medium">
              Purchases
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-sm font-medium">
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="favorites" className="mt-0">
            <CollectorFavorites />
          </TabsContent>
          
          <TabsContent value="purchases" className="mt-0">
            <CollectorPurchases />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <CollectorSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CollectorDashboard;

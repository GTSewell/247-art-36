
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import PWANavigation from "@/components/pwa/PWANavigation";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import CollectorFavorites from "@/components/pwa/CollectorFavorites";
import CollectorPurchases from "@/components/pwa/CollectorPurchases";
import CollectorSettings from "@/components/pwa/CollectorSettings";

const CollectorDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const { isPWA } = useAppMode();
  
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
      <div className="min-h-screen bg-zap-yellow">
        {isPWA ? <PWANavigation /> : <Navigation />}
        <div className="container mx-auto px-4 pt-20 pb-20 flex items-center justify-center">
          <p>Loading collector dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isPWA ? <PWANavigation /> : <Navigation />}
      
      <main className="container mx-auto px-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold mb-6">Collector Dashboard</h1>
        
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="favorites" className="space-y-4">
            <CollectorFavorites />
          </TabsContent>
          
          <TabsContent value="purchases" className="space-y-4">
            <CollectorPurchases />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <CollectorSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CollectorDashboard;

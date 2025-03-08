
import React, { useState, useEffect } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import ArtistArtworkManager from "@/components/pwa/ArtistArtworkManager";
import ArtistProfileSettings from "@/components/pwa/ArtistProfileSettings";
import ArtistSalesAnalytics from "@/components/pwa/ArtistSalesAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ArtistDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("artworks");
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [isArtistProfileLoading, setIsArtistProfileLoading] = useState(true);

  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (!user) return;

      try {
        setIsArtistProfileLoading(true);

        // Check if user has an artist profile
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setArtistProfile(data);
      } catch (error: any) {
        console.error('Error fetching artist profile:', error);
        toast.error(`Failed to load profile: ${error.message}`);
      } finally {
        setIsArtistProfileLoading(false);
      }
    };

    if (user) {
      fetchArtistProfile();
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("You must be signed in to access the artist dashboard");
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading || isArtistProfileLoading) {
    return (
      <div className="min-h-screen bg-zap-yellow">
        <PWANavigation />
        <div className="container mx-auto px-4 pt-20 pb-20">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zap-yellow">
      <PWANavigation />
      
      <main className="container mx-auto px-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold mb-6">Artist Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="artworks">Artworks</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="artworks">
            <ArtistArtworkManager artistProfile={artistProfile} />
          </TabsContent>
          
          <TabsContent value="sales">
            <ArtistSalesAnalytics artistProfile={artistProfile} />
          </TabsContent>
          
          <TabsContent value="profile">
            <ArtistProfileSettings 
              artistProfile={artistProfile}
              setArtistProfile={setArtistProfile}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ArtistDashboard;

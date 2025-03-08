
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import PWANavigation from "@/components/pwa/PWANavigation";
import ArtistArtworkManager from "@/components/pwa/ArtistArtworkManager";
import ArtistProfileSettings from "@/components/pwa/ArtistProfileSettings";
import ArtistSalesAnalytics from "@/components/pwa/ArtistSalesAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ArtistDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [isArtistProfileLoading, setIsArtistProfileLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      toast.error("You must be logged in to view the artist dashboard");
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (!user) return;
      
      try {
        setIsArtistProfileLoading(true);
        
        // First check if user has an artist profile
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setArtistProfile(data[0]);
        } else {
          // If no artist profile, create a default one
          setArtistProfile({
            id: null,
            user_id: user.id,
            name: user.user_metadata?.full_name || "New Artist",
            bio: "",
            specialty: "Digital Art",
            image: "/placeholder.svg",
            techniques: [],
            styles: [],
            social_platforms: [],
            artworks: []
          });
        }
      } catch (error: any) {
        console.error("Error fetching artist profile:", error);
        toast.error(`Failed to load artist profile: ${error.message}`);
      } finally {
        setIsArtistProfileLoading(false);
      }
    };

    if (user) {
      fetchArtistProfile();
    }
  }, [user]);

  if (isLoading || isArtistProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-16">
      <PWANavigation />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Artist Dashboard</h1>
        
        <Tabs defaultValue="artwork" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="artwork">Artwork</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="artwork">
            <Card>
              <CardContent className="p-4">
                <ArtistArtworkManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-4">
                <ArtistSalesAnalytics />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardContent className="p-4">
                <ArtistProfileSettings
                  artistProfile={artistProfile}
                  setArtistProfile={setArtistProfile}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtistDashboard;

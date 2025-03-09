
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PWANavigation from "@/components/pwa/PWANavigation";
import ArtistSalesAnalytics from "@/components/pwa/ArtistSalesAnalytics";
import ArtistArtworkManager from "@/components/pwa/ArtistArtworkManager";
import ArtistProfileSettings from "@/components/pwa/ArtistProfileSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ArtistDashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [artistId, setArtistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Redirect to auth page if not logged in
          toast.error("Please log in to access your dashboard");
          navigate('/auth');
          return;
        }
        
        setUserId(user.id);
        
        // Check if user has an artist profile
        const { data: artistData, error } = await supabase
          .from('artists')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking artist profile:", error);
        }
        
        if (artistData) {
          setArtistId(artistData.id.toString());
        }
        
      } catch (error) {
        console.error("Error in auth check:", error);
        toast.error("Authentication error");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <PWANavigation />
        <div className="container mx-auto pt-20 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-16">
      <PWANavigation />
      <div className="container mx-auto pt-20 px-4">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Artist Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your profile, artworks and view sales analytics.
            </p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="artworks">Artworks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-4">
            <ArtistProfileSettings artistId={userId} />
          </TabsContent>
          
          <TabsContent value="artworks" className="mt-4">
            <ArtistArtworkManager artist={artistId} />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-4">
            <ArtistSalesAnalytics artistId={artistId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtistDashboard;

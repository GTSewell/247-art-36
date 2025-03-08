
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, Image, Settings } from "lucide-react";
import { toast } from "sonner";
import ArtistProfileSettings from "@/components/pwa/ArtistProfileSettings";
import ArtistArtworkManager from "@/components/pwa/ArtistArtworkManager";
import ArtistSalesAnalytics from "@/components/pwa/ArtistSalesAnalytics";

const ArtistDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isArtist, setIsArtist] = useState(false);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please sign in to access the artist dashboard");
      navigate('/auth');
    } else if (user) {
      checkArtistStatus();
    }
  }, [user, isLoading, navigate]);
  
  const checkArtistStatus = async () => {
    try {
      setLoading(true);
      
      // Check if the user has an artist role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id || '')
        .eq('role', 'artist')
        .maybeSingle();
      
      if (roleError) {
        console.error("Error checking artist role:", roleError);
      }
      
      // Check if user is linked to an artist profile
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user?.id || '')
        .maybeSingle();
      
      if (artistError) {
        console.error("Error checking artist profile:", artistError);
      }
      
      if (roleData || artistData) {
        setIsArtist(true);
        if (artistData) {
          setArtistId(artistData.id);
        }
      } else {
        toast.error("You do not have artist access");
        navigate('/');
      }
    } catch (error) {
      console.error("Error checking artist status:", error);
      toast.error("Failed to verify artist status");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-zap-yellow">
        <PWANavigation />
        <div className="container mx-auto px-4 pt-20 pb-20 flex items-center justify-center">
          <p>Loading artist dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PWANavigation />
      
      <main className="container mx-auto px-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold mb-6">Artist Dashboard</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="artworks">Artworks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ArtistProfileSettings artistId={artistId} />
          </TabsContent>
          
          <TabsContent value="artworks" className="space-y-4">
            <ArtistArtworkManager artistId={artistId} />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <ArtistSalesAnalytics artistId={artistId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ArtistDashboard;

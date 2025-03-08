
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ArtistProfileSettings from "@/components/pwa/ArtistProfileSettings";
import ArtistArtworkManager from "@/components/pwa/ArtistArtworkManager";
import ArtistSalesAnalytics from "@/components/pwa/ArtistSalesAnalytics";

// Define explicit interfaces for the artist and role data
interface ArtistRecord {
  id: number;
  user_id: string;
}

interface RoleRecord {
  role: string;
}

const ArtistDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isArtist, setIsArtist] = useState(false);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please sign in to access the artist dashboard");
      navigate("/auth");
    } else if (user) {
      checkArtistStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  const checkArtistStatus = async () => {
    if (!user || !user.id) {
      toast.error("User information is missing");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);

      // Use the user id string directly
      const userIdString = user.id;

      // Check if user has artist role - fix type issues by separating the query from data access
      const roleResponse = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userIdString)
        .eq('role', 'artist');

      // Check if user has an artist profile - fix type issues by separating the query from data access
      const artistResponse = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', userIdString);
      
      // Safely handle potential errors from both queries
      const hasRoleError = roleResponse.error !== null;
      const hasArtistError = artistResponse.error !== null;
      
      if (hasRoleError) {
        console.error("Error checking artist role:", roleResponse.error);
      }

      if (hasArtistError) {
        console.error("Error checking artist profile:", artistResponse.error);
      }

      // Safely check if data exists and has length
      const hasArtistRole = !hasRoleError && roleResponse.data && roleResponse.data.length > 0;
      const hasArtistProfile = !hasArtistError && artistResponse.data && artistResponse.data.length > 0;
      
      if (hasArtistRole || hasArtistProfile) {
        setIsArtist(true);
        if (hasArtistProfile && artistResponse.data && artistResponse.data.length > 0) {
          setArtistId(artistResponse.data[0].id);
        }
      } else {
        toast.error("You do not have artist access");
        navigate("/");
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


import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import LinktreeDashboard from "@/components/pwa/dashboard/LinktreeDashboard";

const ArtistDashboard: React.FC = () => {
  const { user } = useAuth();
  const [artistId, setArtistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchArtistId = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Check if this is the demo account
      const isDemo = user?.email?.includes('demo') || user?.email?.includes('247art');
      
      if (isDemo) {
        setArtistId("demo");
        setLoading(false);
        return;
      }

      try {
        // Look up the artist by user_id to get the numeric artist ID
        const { data: artist, error } = await supabase
          .from('artists')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching artist:', error);
          setArtistId(null);
        } else if (artist) {
          setArtistId(artist.id.toString());
        } else {
          // No artist found for this user - they might need to create one
          setArtistId(null);
        }
      } catch (error) {
        console.error('Error fetching artist:', error);
        setArtistId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistId();
  }, [user?.id, user?.email]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <LinktreeDashboard artistId={artistId} />;
};

export default ArtistDashboard;

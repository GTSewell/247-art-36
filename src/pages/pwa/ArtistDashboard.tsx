
import React, { useState, useEffect } from 'react';
import PWANavigation from '@/components/pwa/PWANavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArtistProfileSettings from '@/components/pwa/ArtistProfileSettings';
import ArtistArtworkManager from '@/components/pwa/ArtistArtworkManager';
import ArtistSalesAnalytics from '@/components/pwa/ArtistSalesAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

const ArtistDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [artistId, setArtistId] = useState<number | null>(null);

  useEffect(() => {
    const fetchArtistId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const { data, error } = await supabase
            .from('artists')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (error) {
            logger.error('Error fetching artist ID:', error);
            return;
          }

          if (data) {
            setArtistId(data.id);
          }
        } catch (error) {
          logger.error('Error in fetchArtistId:', error);
        }
      }
    };

    fetchArtistId();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PWANavigation />

      <main className="container mx-auto px-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold mb-4">Artist Dashboard</h1>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="artworks">Artworks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ArtistProfileSettings artistId={artistId} />
          </TabsContent>
          <TabsContent value="artworks">
            <ArtistArtworkManager artistId={artistId} />
          </TabsContent>
          <TabsContent value="analytics">
            <ArtistSalesAnalytics artistId={artistId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ArtistDashboard;

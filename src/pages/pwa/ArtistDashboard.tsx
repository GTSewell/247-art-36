
import React, { useState } from 'react';
import PWANavigation from '@/components/pwa/PWANavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArtistProfileSettings from '@/components/pwa/ArtistProfileSettings';
import ArtistArtworkManager from '@/components/pwa/ArtistArtworkManager';
import ArtistSalesAnalytics from '@/components/pwa/ArtistSalesAnalytics';

const ArtistDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

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
            <ArtistProfileSettings />
          </TabsContent>
          <TabsContent value="artworks">
            <ArtistArtworkManager />
          </TabsContent>
          <TabsContent value="analytics">
            <ArtistSalesAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ArtistDashboard;

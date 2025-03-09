
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PWANavigation from '@/components/pwa/PWANavigation';
import ArtistProfileSettings from '@/components/pwa/ArtistProfileSettings';
import ArtistArtworkManager from '@/components/pwa/ArtistArtworkManager';
import ArtistSalesAnalytics from '@/components/pwa/ArtistSalesAnalytics';

const MOCK_ARTIST_ID = 1; // For development purposes

const ArtistDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Hardcoded artist ID for development
  const artistId = MOCK_ARTIST_ID;

  return (
    <div className="pb-20 pt-16 min-h-screen bg-gray-50">
      <PWANavigation />
      
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Artist Dashboard</h1>
        
        <Tabs 
          defaultValue="profile" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
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
      </div>
    </div>
  );
};

export default ArtistDashboard;

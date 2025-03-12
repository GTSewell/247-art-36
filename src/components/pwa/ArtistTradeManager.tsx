
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MyTrades from "./trade/MyTrades";
import ArtistTrades from "./trade/ArtistTrades";
import TradedHistory from "./trade/TradedHistory";

interface ArtistTradeManagerProps {
  artistId: string | null;
}

const ArtistTradeManager: React.FC<ArtistTradeManagerProps> = ({ artistId }) => {
  const [activeSection, setActiveSection] = useState("my-trades");

  if (!artistId) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-0">
        <CardContent className="pt-6">
          <p className="text-white">No artist profile found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card/60 backdrop-blur-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-white">Trade Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeSection} 
            onValueChange={setActiveSection} 
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-3 gap-2 mb-4">
              <TabsTrigger value="my-trades">My Trades</TabsTrigger>
              <TabsTrigger value="artist-trades">Artist Trades</TabsTrigger>
              <TabsTrigger value="traded">Traded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-trades" className="space-y-4">
              <MyTrades artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="artist-trades" className="space-y-4">
              <ArtistTrades artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="traded" className="space-y-4">
              <TradedHistory artistId={artistId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistTradeManager;

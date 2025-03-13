
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MyTrades from "./trade/MyTrades";
import ArtistTrades from "./trade/ArtistTrades";
import TradedHistory from "./trade/TradedHistory";
import TradeRequests from "./trade/TradeRequests";

interface ArtistTradeManagerProps {
  artistId: string | null;
}

const ArtistTradeManager: React.FC<ArtistTradeManagerProps> = ({ artistId }) => {
  const [activeSection, setActiveSection] = useState("my-trades");

  if (!artistId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No artist profile found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <Tabs 
            value={activeSection} 
            onValueChange={setActiveSection} 
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 gap-2 mb-6">
              <TabsTrigger value="my-trades" className="h-10">My Trades</TabsTrigger>
              <TabsTrigger value="artist-trades" className="h-10">Artist Trades</TabsTrigger>
              <TabsTrigger value="requests" className="h-10">Requests</TabsTrigger>
              <TabsTrigger value="traded" className="h-10">Traded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-trades" className="space-y-4 pt-2">
              <MyTrades artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="artist-trades" className="space-y-4 pt-2">
              <ArtistTrades artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="requests" className="space-y-4 pt-2">
              <TradeRequests artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="traded" className="space-y-4 pt-2">
              <TradedHistory artistId={artistId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistTradeManager;

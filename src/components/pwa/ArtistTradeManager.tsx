
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MyTrades from "./trade/MyTrades";
import ArtistTrades from "./trade/ArtistTrades";
import TradedHistory from "./trade/TradedHistory";
import TradeRequests from "./trade/TradeRequests";
import { useAppMode } from "@/contexts/AppModeContext";

interface ArtistTradeManagerProps {
  artistId: string | null;
}

const ArtistTradeManager: React.FC<ArtistTradeManagerProps> = ({ artistId }) => {
  const [activeSection, setActiveSection] = useState("my-trades");
  const { isPWA } = useAppMode();

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
            className="trade-tabs-container"
          >
            <div className={`sticky top-0 ${isPWA ? 'bg-background' : 'bg-transparent'} z-30 pb-6`}>
              <TabsList className="w-full mb-10 grid grid-cols-2 gap-4 bg-transparent"> {/* Removed text-white class */}
                <TabsTrigger 
                  value="my-trades" 
                  className="trade-main-tab h-16 text-sm md:text-base font-medium"
                >
                  My Trades
                </TabsTrigger>
                <TabsTrigger 
                  value="artist-trades" 
                  className="trade-main-tab h-16 text-sm md:text-base font-medium"
                >
                  Artist Trades
                </TabsTrigger>
                <TabsTrigger 
                  value="requests" 
                  className="trade-main-tab h-16 text-sm md:text-base font-medium"
                >
                  Requests
                </TabsTrigger>
                <TabsTrigger 
                  value="traded" 
                  className="trade-main-tab h-16 text-sm md:text-base font-medium"
                >
                  Traded
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="my-trades" className="space-y-4 mt-10 pt-6">
              <MyTrades artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="artist-trades" className="space-y-4 mt-10 pt-6">
              <ArtistTrades artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="requests" className="space-y-4 mt-10 pt-6">
              <TradeRequests artistId={artistId} />
            </TabsContent>
            
            <TabsContent value="traded" className="space-y-4 mt-10 pt-6">
              <TradedHistory artistId={artistId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistTradeManager;

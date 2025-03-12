
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArtworkTradeItem } from "./types";
import { toast } from "sonner";

interface MyTradesProps {
  artistId: string;
}

const MyTrades: React.FC<MyTradesProps> = ({ artistId }) => {
  const [artworks, setArtworks] = useState<ArtworkTradeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    const fetchArtworks = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          // Mock data
          const mockArtworks: ArtworkTradeItem[] = [
            {
              id: "1",
              title: "Neon Dreams",
              image: "/lovable-uploads/2f884c19-75ec-4f8c-a501-ebc90a17c2c6.png",
              artist: "You",
              price: 120,
              productionCost: 40,
              isTradeEnabled: true,
              dateCreated: "2023-10-15"
            },
            {
              id: "2",
              title: "Urban Vibes",
              image: "/lovable-uploads/35c806e4-6bf2-4984-9996-9c61c1d74879.png",
              artist: "You",
              price: 85,
              productionCost: 30,
              isTradeEnabled: false,
              dateCreated: "2023-11-22"
            },
            {
              id: "3",
              title: "Abstract Fusion",
              image: "/lovable-uploads/d0e2f0f5-3e1b-4aca-ba46-dd13f40890ce.png",
              artist: "You",
              price: 150,
              productionCost: 50,
              isTradeEnabled: true,
              dateCreated: "2023-09-05"
            }
          ];
          
          setArtworks(mockArtworks);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching artworks:", error);
        toast.error("Failed to load your artworks");
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [artistId]);

  const handleTradeToggle = (artworkId: string, newStatus: boolean) => {
    setArtworks(prevArtworks => 
      prevArtworks.map(artwork => 
        artwork.id === artworkId 
          ? {...artwork, isTradeEnabled: newStatus} 
          : artwork
      )
    );
    
    // In a real implementation, this would update the database
    toast.success(`Trade option ${newStatus ? 'enabled' : 'disabled'} for artwork`);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-card/40 backdrop-blur-sm animate-pulse">
            <CardContent className="p-4 h-24"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/80">
        Enable trade options for your artworks to allow other artists to trade with you at production cost.
      </p>
      
      {artworks.length === 0 ? (
        <Card className="bg-card/40 backdrop-blur-sm">
          <CardContent className="p-4 text-center text-white/70">
            You don't have any artworks yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {artworks.map(artwork => (
            <Card key={artwork.id} className="bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-colors">
              <CardContent className="p-4 flex items-center space-x-4">
                <img 
                  src={artwork.image} 
                  alt={artwork.title} 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="text-white font-medium">{artwork.title}</h3>
                  <p className="text-xs text-white/70">
                    Retail: ${artwork.price} • Production: ${artwork.productionCost}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`trade-switch-${artwork.id}`}
                    checked={artwork.isTradeEnabled}
                    onCheckedChange={(checked) => handleTradeToggle(artwork.id, checked)}
                  />
                  <Label 
                    htmlFor={`trade-switch-${artwork.id}`}
                    className="text-sm text-white/80"
                  >
                    {artwork.isTradeEnabled ? "On" : "Off"}
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrades;

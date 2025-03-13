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
          // Mock data with artwork images
          const mockArtworks: ArtworkTradeItem[] = [
            {
              id: "1",
              title: "Mountain Sunset",
              image: "/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png",
              artist: "You",
              price: 120,
              productionCost: 40,
              isTradeEnabled: true,
              dateCreated: "2023-10-15"
            },
            {
              id: "2",
              title: "Ocean Waves",
              image: "/lovable-uploads/e16074dd-11b0-4f2e-bcc8-06b5fa6c282a.png",
              artist: "You",
              price: 85,
              productionCost: 30,
              isTradeEnabled: false,
              dateCreated: "2023-11-22"
            },
            {
              id: "3",
              title: "Abstract Dreams",
              image: "/lovable-uploads/e0deff39-8fe2-4550-ab0c-1e69017df558.png",
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
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 h-24"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enable trade options for your artworks to allow other artists to trade with you at production cost.
      </p>
      
      {artworks.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            You don't have any artworks yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {artworks.map(artwork => (
            <Card key={artwork.id} className="transition-colors">
              <CardContent className="p-4 flex items-center space-x-4">
                <img 
                  src={artwork.image} 
                  alt={artwork.title} 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{artwork.title}</h3>
                  <p className="text-xs text-muted-foreground">
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
                    className="text-sm text-muted-foreground"
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

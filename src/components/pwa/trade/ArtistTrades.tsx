
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArtworkTradeItem } from "./types";
import { toast } from "sonner";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ArtistTradesProps {
  artistId: string;
}

const ArtistTrades: React.FC<ArtistTradesProps> = ({ artistId }) => {
  const [tradeableArtworks, setTradeableArtworks] = useState<ArtworkTradeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    const fetchTradeableArtworks = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          // Mock data
          const mockArtworks: ArtworkTradeItem[] = [
            {
              id: "101",
              title: "City Lights",
              image: "/lovable-uploads/ba2acde7-f602-4a0e-b52f-f5b1b5a3689e.png",
              artist: "Jane Doe",
              price: 110,
              productionCost: 35,
              isTradeEnabled: true,
              dateCreated: "2023-08-10"
            },
            {
              id: "102",
              title: "Ocean Breeze",
              image: "/lovable-uploads/cf5565b7-f7b3-4c38-bdbb-99b1bfb3b192.png",
              artist: "Mike Smith",
              price: 95,
              productionCost: 30,
              isTradeEnabled: true,
              dateCreated: "2023-07-22"
            },
            {
              id: "103",
              title: "Forest Dreams",
              image: "/lovable-uploads/feaf3c11-b562-453d-b538-e05a75a839a4.png",
              artist: "Alex Johnson",
              price: 135,
              productionCost: 45,
              isTradeEnabled: true,
              dateCreated: "2023-09-15"
            },
            {
              id: "104",
              title: "Desert Storm",
              image: "/lovable-uploads/fbba846a-cd1a-49f7-9772-3d4da9f82b33.png",
              artist: "Sarah Williams",
              price: 120,
              productionCost: 40,
              isTradeEnabled: true,
              dateCreated: "2023-10-01"
            }
          ];
          
          setTradeableArtworks(mockArtworks);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching tradeable artworks:", error);
        toast.error("Failed to load tradeable artworks");
        setLoading(false);
      }
    };

    fetchTradeableArtworks();
  }, [artistId]);

  const handleRequestTrade = (artworkId: string, artistName: string) => {
    // In a real implementation, this would open a trade request modal
    toast.success(`Trade request with ${artistName} initiated`);
  };

  const filteredArtworks = tradeableArtworks.filter(artwork => {
    // Filter by search term
    const matchesSearch = 
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category if one is selected
    const matchesCategory = !selectedCategory || artwork.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search artists or artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-card/40 border-0 text-white placeholder:text-white/50"
          />
        </div>
      </div>
      
      <p className="text-sm text-white/80 mb-2">
        Browse artworks available for trade from other artists.
      </p>
      
      {filteredArtworks.length === 0 ? (
        <Card className="bg-card/40 backdrop-blur-sm">
          <CardContent className="p-4 text-center text-white/70">
            No tradeable artworks found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredArtworks.map(artwork => (
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
                    Artist: {artwork.artist}
                  </p>
                  <p className="text-xs text-white/70">
                    Trade Cost: ${artwork.productionCost} (Retail: ${artwork.price})
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white/10 hover:bg-white/20 text-white"
                  onClick={() => handleRequestTrade(artwork.id, artwork.artist)}
                >
                  Request <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistTrades;

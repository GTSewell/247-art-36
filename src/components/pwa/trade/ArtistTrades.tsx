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
          // Mock data with artwork images from actual artist uploads
          const mockArtworks: ArtworkTradeItem[] = [
            {
              id: "101",
              title: "Desert Dreams",
              image: "/lovable-uploads/5277ffb4-1849-4a10-9964-bb459163cabc.png",
              artist: "Jane Doe",
              price: 110,
              productionCost: 35,
              isTradeEnabled: true,
              dateCreated: "2023-08-10"
            },
            {
              id: "102",
              title: "Forest Fantasy",
              image: "/lovable-uploads/ddc18b16-629a-42e8-a97e-af21acb3e67a.png",
              artist: "Mike Smith",
              price: 95,
              productionCost: 30,
              isTradeEnabled: true,
              dateCreated: "2023-07-22"
            },
            {
              id: "103",
              title: "Starry Night",
              image: "/lovable-uploads/c1aa52df-209a-44c5-9706-d2209db8a011.png",
              artist: "Alex Johnson",
              price: 135,
              productionCost: 45,
              isTradeEnabled: true,
              dateCreated: "2023-09-15"
            },
            {
              id: "104",
              title: "Urban Landscape",
              image: "/lovable-uploads/44037d7b-42de-43f6-86ef-1eb4983e970b.png",
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
          <Card key={i} className="animate-pulse">
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
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artists or artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-2">
        Browse artworks available for trade from other artists.
      </p>
      
      {filteredArtworks.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            No tradeable artworks found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredArtworks.map(artwork => (
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
                    Artist: {artwork.artist}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Trade Cost: ${artwork.productionCost} (Retail: ${artwork.price})
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
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

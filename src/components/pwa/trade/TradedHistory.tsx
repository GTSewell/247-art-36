import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TradeTransaction } from "./types";
import { toast } from "sonner";

interface TradedHistoryProps {
  artistId: string;
}

const TradedHistory: React.FC<TradedHistoryProps> = ({ artistId }) => {
  const [tradeHistory, setTradeHistory] = useState<TradeTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    const fetchTradeHistory = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          // Mock data with artwork images
          const mockHistory: TradeTransaction[] = [
            {
              id: "t1",
              artistIdFrom: artistId,
              artistIdTo: "other-artist-1",
              artistNameFrom: "You",
              artistNameTo: "Jane Doe",
              artworkFrom: {
                id: "1",
                title: "Mountain Sunset",
                image: "/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png"
              },
              artworkTo: {
                id: "101",
                title: "Desert Dreams",
                image: "/lovable-uploads/5277ffb4-1849-4a10-9964-bb459163cabc.png"
              },
              status: "completed",
              dateCreated: "2023-11-05",
              dateUpdated: "2023-11-07"
            },
            {
              id: "t2",
              artistIdFrom: "other-artist-2",
              artistIdTo: artistId,
              artistNameFrom: "Mike Smith",
              artistNameTo: "You",
              artworkFrom: {
                id: "102",
                title: "Forest Fantasy",
                image: "/lovable-uploads/ddc18b16-629a-42e8-a97e-af21acb3e67a.png"
              },
              artworkTo: {
                id: "3",
                title: "Abstract Dreams",
                image: "/lovable-uploads/e0deff39-8fe2-4550-ab0c-1e69017df558.png"
              },
              status: "pending",
              dateCreated: "2023-12-01",
              dateUpdated: "2023-12-01"
            }
          ];
          
          setTradeHistory(mockHistory);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching trade history:", error);
        toast.error("Failed to load trade history");
        setLoading(false);
      }
    };

    fetchTradeHistory();
  }, [artistId]);

  const getStatusColor = (status: TradeTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'declined':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 h-32"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        View all your past and pending trade transactions.
      </p>
      
      {tradeHistory.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            You haven't made any trades yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tradeHistory.map(trade => (
            <Card key={trade.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-muted-foreground text-sm">
                      {new Date(trade.dateCreated).toLocaleDateString()}
                    </span>
                    <Badge className={`ml-2 ${getStatusColor(trade.status)}`}>
                      {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    ID: {trade.id.substring(0, 8)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {trade.artistIdFrom === artistId ? "Your Artwork" : `From: ${trade.artistNameFrom}`}
                    </p>
                    <div className="flex items-center space-x-2">
                      <img 
                        src={trade.artworkFrom.image} 
                        alt={trade.artworkFrom.title} 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <span className="text-sm">{trade.artworkFrom.title}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {trade.artistIdTo === artistId ? "Your Artwork" : `To: ${trade.artistNameTo}`}
                    </p>
                    <div className="flex items-center space-x-2">
                      <img 
                        src={trade.artworkTo.image} 
                        alt={trade.artworkTo.title} 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <span className="text-sm">{trade.artworkTo.title}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradedHistory;

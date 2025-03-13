
import { useState, useEffect } from "react";
import { TradeRequestItem } from "../../types";
import { toast } from "sonner";

export const useTradeRequests = (artistId: string) => {
  const [tradeRequests, setTradeRequests] = useState<TradeRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TradeRequestItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    const fetchTradeRequests = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          // Mock data with artwork images
          const mockRequests: TradeRequestItem[] = [
            {
              id: "req1",
              type: "received",
              status: "pending",
              fromArtist: {
                id: "artist2",
                name: "Jane Doe"
              },
              toArtist: {
                id: artistId,
                name: "You"
              },
              fromArtwork: {
                id: "a101",
                title: "Desert Dreams",
                image: "/lovable-uploads/81ef7ddd-20a1-4d19-b586-27ac2f6afe2b.png",
                productionCost: 35
              },
              toArtwork: {
                id: "a1",
                title: "Mountain Sunset",
                image: "/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png",
                productionCost: 40
              },
              message: "I love your Mountain Sunset piece and would like to trade with my Desert Dreams. Let me know if you're interested!",
              dateCreated: "2023-12-05",
              isRead: false
            },
            {
              id: "req2",
              type: "received",
              status: "pending",
              fromArtist: {
                id: "artist3",
                name: "Mike Smith"
              },
              toArtist: {
                id: artistId,
                name: "You"
              },
              fromArtwork: {
                id: "a102",
                title: "Forest Fantasy",
                image: "/lovable-uploads/ddc18b16-629a-42e8-a97e-af21acb3e67a.png",
                productionCost: 30
              },
              toArtwork: {
                id: "a3",
                title: "Abstract Dreams",
                image: "/lovable-uploads/e0deff39-8fe2-4550-ab0c-1e69017df558.png",
                productionCost: 50
              },
              message: "Your Abstract Dreams artwork would be perfect for my collection. Would you consider trading?",
              dateCreated: "2023-12-10",
              isRead: true
            },
            {
              id: "req3",
              type: "sent",
              status: "pending",
              fromArtist: {
                id: artistId,
                name: "You"
              },
              toArtist: {
                id: "artist4",
                name: "Sarah Williams"
              },
              fromArtwork: {
                id: "a1",
                title: "Mountain Sunset",
                image: "/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png",
                productionCost: 40
              },
              toArtwork: {
                id: "a104",
                title: "Urban Landscape",
                image: "/lovable-uploads/44037d7b-42de-43f6-86ef-1eb4983e970b.png",
                productionCost: 40
              },
              message: "I'd love to trade my Mountain Sunset for your Urban Landscape. Let me know what you think!",
              dateCreated: "2023-12-08",
              isRead: true
            }
          ];
          
          setTradeRequests(mockRequests);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching trade requests:", error);
        toast.error("Failed to load trade requests");
        setLoading(false);
      }
    };

    fetchTradeRequests();
  }, [artistId]);

  const handleAcceptTrade = (requestId: string) => {
    setTradeRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' } : req
      )
    );
    toast.success("Trade request accepted");
    setIsDetailsOpen(false);
  };

  const handleDeclineTrade = (requestId: string) => {
    setTradeRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'declined' } : req
      )
    );
    toast.success("Trade request declined");
    setIsDetailsOpen(false);
  };

  const handleViewDetails = (request: TradeRequestItem) => {
    // Mark as read if it's a received request
    if (request.type === 'received' && !request.isRead) {
      setTradeRequests(prev => 
        prev.map(req => 
          req.id === request.id ? { ...req, isRead: true } : req
        )
      );
    }
    
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const filteredRequests = tradeRequests.filter(req => req.type === activeTab);
  const unreadCount = tradeRequests.filter(req => req.type === 'received' && !req.isRead).length;

  return {
    loading,
    tradeRequests,
    filteredRequests,
    unreadCount,
    selectedRequest,
    isDetailsOpen,
    activeTab,
    setActiveTab,
    setIsDetailsOpen,
    handleAcceptTrade,
    handleDeclineTrade,
    handleViewDetails
  };
};

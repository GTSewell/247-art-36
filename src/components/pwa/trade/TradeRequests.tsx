
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TradeRequestItem } from "./types";
import { toast } from "sonner";
import { Check, X, Mail, MailOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradeRequestsProps {
  artistId: string;
}

const TradeRequests: React.FC<TradeRequestsProps> = ({ artistId }) => {
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

  const renderRequestIcon = (request: TradeRequestItem) => {
    if (request.type === 'received' && !request.isRead) {
      return <Mail className="h-4 w-4 text-blue-500" />;
    } else {
      return <MailOpen className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-red-500">Declined</Badge>;
      default:
        return null;
    }
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="received">
            Received 
            {tradeRequests.filter(req => req.type === 'received' && !req.isRead).length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                {tradeRequests.filter(req => req.type === 'received' && !req.isRead).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          <p className="text-sm text-muted-foreground mb-2">
            Trade requests from other artists.
          </p>
          
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                No trade requests received.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(request => (
                <Card key={request.id} className={`transition-colors ${!request.isRead ? 'border-blue-300' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {renderRequestIcon(request)}
                        <span className="text-sm font-medium">
                          From: {request.fromArtist.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(request.dateCreated).toLocaleDateString()}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={request.fromArtwork.image} 
                          alt={request.fromArtwork.title} 
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="text-sm">{request.fromArtwork.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Cost: ${request.fromArtwork.productionCost}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <img 
                          src={request.toArtwork.image} 
                          alt={request.toArtwork.title} 
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="text-sm">{request.toArtwork.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Cost: ${request.toArtwork.productionCost}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        View Details
                      </Button>
                      
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeclineTrade(request.id)}
                          >
                            <X className="h-4 w-4 mr-1" /> Decline
                          </Button>
                          <Button 
                            size="sm"
                            variant="default"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleAcceptTrade(request.id)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent">
          <p className="text-sm text-muted-foreground mb-2">
            Trade requests you've sent to other artists.
          </p>
          
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                You haven't sent any trade requests.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(request => (
                <Card key={request.id} className="transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {renderRequestIcon(request)}
                        <span className="text-sm font-medium">
                          To: {request.toArtist.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(request.dateCreated).toLocaleDateString()}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={request.fromArtwork.image} 
                          alt={request.fromArtwork.title} 
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="text-sm">{request.fromArtwork.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Cost: ${request.fromArtwork.productionCost}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <img 
                          src={request.toArtwork.image} 
                          alt={request.toArtwork.title} 
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="text-sm">{request.toArtwork.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Cost: ${request.toArtwork.productionCost}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(request)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Trade Request Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Trade Request Details</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm font-medium">
                      {selectedRequest.type === 'received' ? 'From:' : 'To:'} {selectedRequest.type === 'received' ? selectedRequest.fromArtist.name : selectedRequest.toArtist.name}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedRequest.dateCreated).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md mb-4">
                  <p className="text-sm">{selectedRequest.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {selectedRequest.type === 'received' ? 'Their Artwork:' : 'Your Artwork:'}
                    </h4>
                    <div className="space-y-2">
                      <img 
                        src={selectedRequest.fromArtwork.image} 
                        alt={selectedRequest.fromArtwork.title} 
                        className="w-full h-36 object-cover rounded-md"
                      />
                      <p className="text-sm font-medium">{selectedRequest.fromArtwork.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Production Cost: ${selectedRequest.fromArtwork.productionCost}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {selectedRequest.type === 'received' ? 'Your Artwork:' : 'Their Artwork:'}
                    </h4>
                    <div className="space-y-2">
                      <img 
                        src={selectedRequest.toArtwork.image} 
                        alt={selectedRequest.toArtwork.title} 
                        className="w-full h-36 object-cover rounded-md"
                      />
                      <p className="text-sm font-medium">{selectedRequest.toArtwork.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Production Cost: ${selectedRequest.toArtwork.productionCost}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                <div>
                  <span className="text-sm font-medium mr-2">Status:</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                
                {selectedRequest.type === 'received' && selectedRequest.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="destructive"
                      onClick={() => handleDeclineTrade(selectedRequest.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Decline
                    </Button>
                    <Button 
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleAcceptTrade(selectedRequest.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Accept
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TradeRequests;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TradeRequestItem } from "../types";
import { Mail, MailOpen } from "lucide-react";

interface RequestListItemProps {
  request: TradeRequestItem;
  onViewDetails: (request: TradeRequestItem) => void;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const RequestListItem: React.FC<RequestListItemProps> = ({
  request,
  onViewDetails,
  onAccept,
  onDecline,
}) => {
  const renderRequestIcon = () => {
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

  return (
    <Card key={request.id} className={`transition-colors ${!request.isRead ? 'border-blue-300' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {renderRequestIcon()}
            <span className="text-sm font-medium">
              {request.type === 'received' ? `From: ${request.fromArtist.name}` : `To: ${request.toArtist.name}`}
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
            onClick={() => onViewDetails(request)}
          >
            View Details
          </Button>
          
          {request.type === 'received' && request.status === 'pending' && (
            <div className="flex space-x-2">
              <Button 
                size="sm"
                variant="destructive"
                onClick={() => onDecline(request.id)}
              >
                Decline
              </Button>
              <Button 
                size="sm"
                variant="default"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => onAccept(request.id)}
              >
                Accept
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestListItem;

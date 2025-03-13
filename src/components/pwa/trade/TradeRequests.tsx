
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestListItem from "./requests/RequestListItem";
import RequestDetailsDialog from "./requests/RequestDetailsDialog";
import EmptyRequestState from "./requests/EmptyRequestState";
import RequestsLoading from "./requests/RequestsLoading";
import { useTradeRequests } from "./requests/hooks/useTradeRequests";

interface TradeRequestsProps {
  artistId: string;
}

const TradeRequests: React.FC<TradeRequestsProps> = ({ artistId }) => {
  const {
    loading,
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
  } = useTradeRequests(artistId);

  if (loading) {
    return <RequestsLoading />;
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="received">
            Received 
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          <p className="text-sm text-muted-foreground mb-3">
            Trade requests from other artists.
          </p>
          
          {filteredRequests.length === 0 ? (
            <EmptyRequestState message="No trade requests received." />
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(request => (
                <RequestListItem 
                  key={request.id}
                  request={request}
                  onViewDetails={handleViewDetails}
                  onAccept={handleAcceptTrade}
                  onDecline={handleDeclineTrade}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent">
          <p className="text-sm text-muted-foreground mb-3">
            Trade requests you've sent to other artists.
          </p>
          
          {filteredRequests.length === 0 ? (
            <EmptyRequestState message="You haven't sent any trade requests." />
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(request => (
                <RequestListItem 
                  key={request.id}
                  request={request}
                  onViewDetails={handleViewDetails}
                  onAccept={handleAcceptTrade}
                  onDecline={handleDeclineTrade}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Trade Request Details Dialog */}
      <RequestDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        selectedRequest={selectedRequest}
        onAccept={handleAcceptTrade}
        onDecline={handleDeclineTrade}
      />
    </div>
  );
};

export default TradeRequests;

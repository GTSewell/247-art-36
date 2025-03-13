
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestListItem from "./requests/RequestListItem";
import RequestDetailsDialog from "./requests/RequestDetailsDialog";
import EmptyRequestState from "./requests/EmptyRequestState";
import RequestsLoading from "./requests/RequestsLoading";
import { useTradeRequests } from "./requests/hooks/useTradeRequests";
import { useAppMode } from "@/contexts/AppModeContext";

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
  const { isPWA } = useAppMode();

  if (loading) {
    return <RequestsLoading />;
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className={`sticky top-0 ${isPWA ? 'bg-background' : 'bg-transparent'} z-10 pb-6`}>
          <TabsList className="grid w-full grid-cols-2 gap-4 mb-8 bg-transparent">
            <TabsTrigger value="received" className="trade-inner-tab h-14 font-medium">
              Received 
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="trade-inner-tab h-14 font-medium">Sent</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="received" className="mt-8 pt-4">
          <p className="text-sm text-muted-foreground mb-4">
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

        <TabsContent value="sent" className="mt-8 pt-4">
          <p className="text-sm text-muted-foreground mb-4">
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

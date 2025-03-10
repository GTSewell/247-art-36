
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Download, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import CollectorTable from "./collectors/CollectorTable";
import CollectorMessageModal from "./collectors/CollectorMessageModal";
import { collectors as initialCollectors } from "./collectors/mockData";
import { useCollectorExport } from "./collectors/useCollectorExport";
import { Collector } from "./collectors/types";

const MyCollectorsCard: React.FC = () => {
  const isMobile = useIsMobile();
  const [collectors, setCollectors] = useState<Collector[]>(initialCollectors);
  const { handleDownload } = useCollectorExport(collectors);
  const [selectedCollectorIds, setSelectedCollectorIds] = useState<string[]>([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const handleSelectCollector = (id: string) => {
    setSelectedCollectorIds(prev => 
      prev.includes(id) 
        ? prev.filter(collectorId => collectorId !== id) 
        : [...prev, id]
    );
  };

  const handleMessageSent = (collectorIds: string[]) => {
    setCollectors(prevCollectors => 
      prevCollectors.map(collector => 
        collectorIds.includes(collector.id) 
          ? { ...collector, messageSent: true } 
          : collector
      )
    );
  };

  const selectedCollectors = collectors.filter(collector => 
    selectedCollectorIds.includes(collector.id)
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="sticky top-0 z-40 bg-white border-b shadow-lg">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          My Collectors
        </CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center gap-2",
              selectedCollectorIds.length > 0 
                ? "bg-zap-blue text-white hover:bg-zap-blue/90 border-none"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300 border-none"
            )}
            disabled={selectedCollectorIds.length === 0}
            onClick={() => setMessageModalOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
            Send Message
          </Button>
          <Button 
            variant="outline" 
            className="bg-zap-green text-white hover:bg-zap-green/90 border-none flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download List
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[350px] relative">
          <ScrollArea className="h-full w-full">
            <div className={cn(
              isMobile ? "overflow-x-auto" : ""
            )}>
              <CollectorTable 
                collectors={collectors} 
                selectedCollectors={selectedCollectorIds}
                onSelectCollector={handleSelectCollector}
              />
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      <CollectorMessageModal 
        open={messageModalOpen}
        onOpenChange={setMessageModalOpen}
        selectedCollectors={selectedCollectors}
        onMessageSent={handleMessageSent}
      />
    </Card>
  );
};

export default MyCollectorsCard;

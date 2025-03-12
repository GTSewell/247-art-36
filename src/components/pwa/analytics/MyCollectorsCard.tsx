
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye, Download } from "lucide-react";
import CollectorTable from "./collectors/CollectorTable";
import CollectorMessageModal from "./collectors/CollectorMessageModal";
import { collectors } from "./collectors/mockData";
import { useCollectorExport } from "./collectors/useCollectorExport";

interface MyCollectorsCardProps {
  onAction: (actionName?: string) => boolean;
}

const MyCollectorsCard: React.FC<MyCollectorsCardProps> = ({ onAction }) => {
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState<any>(null);
  const { exportCollectors, exportInProgress } = useCollectorExport();
  
  const handleMessageClick = (collector?: any) => {
    // Check if we should block the action
    if (onAction("Message collector")) {
      return; // Action was blocked
    }
    
    if (collector) {
      setSelectedCollector(collector);
    }
    setMessageModalOpen(true);
  };
  
  const handleViewClick = (collector: any) => {
    // Check if we should block the action
    if (onAction("View collector profile")) {
      return; // Action was blocked
    }
    
    console.log("View collector:", collector);
    // Add actual navigation or modal to view collector profile
  };
  
  const handleExportClick = () => {
    // Check if we should block the action
    if (onAction("Export collectors")) {
      return; // Action was blocked
    }
    
    exportCollectors(collectors);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium">My Collectors</CardTitle>
            <CardDescription>
              People who have purchased your art
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportClick}
            disabled={exportInProgress}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CollectorTable 
            collectors={collectors}
            onMessageClick={handleMessageClick}
            onViewClick={handleViewClick}
          />
        </div>
      </CardContent>
      
      <CollectorMessageModal
        open={messageModalOpen}
        onOpenChange={setMessageModalOpen}
        collector={selectedCollector}
      />
    </Card>
  );
};

export default MyCollectorsCard;

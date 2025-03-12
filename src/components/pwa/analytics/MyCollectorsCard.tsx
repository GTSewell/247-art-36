
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Mail, MoreHorizontal } from "lucide-react";
import CollectorTable from "./collectors/CollectorTable";
import { Collector } from "./collectors/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CollectorMessageModal from "./collectors/CollectorMessageModal";
import { toast } from "sonner";
import { useCollectorExport } from "./collectors/useCollectorExport";

// Mock collectors data for demo
const MOCK_COLLECTORS: Collector[] = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    email: "sarah.j@example.com", 
    avatarUrl: "", 
    lastPurchase: "2023-10-15",
    purchaseCount: 3,
    totalValue: 1250
  },
  { 
    id: 2, 
    name: "Michael Chen", 
    email: "mchen@example.com", 
    avatarUrl: "", 
    lastPurchase: "2023-11-02",
    purchaseCount: 5,
    totalValue: 2750
  },
  { 
    id: 3, 
    name: "Emma Williams", 
    email: "emma.w@example.com", 
    avatarUrl: "", 
    lastPurchase: "2023-09-28",
    purchaseCount: 2,
    totalValue: 850
  },
  { 
    id: 4, 
    name: "James Peterson", 
    email: "jpeterson@example.com", 
    avatarUrl: "", 
    lastPurchase: "2023-10-20",
    purchaseCount: 1,
    totalValue: 425
  }
];

interface MyCollectorsCardProps {
  onAction?: (actionName?: string) => boolean | void;
}

const MyCollectorsCard: React.FC<MyCollectorsCardProps> = ({ onAction }) => {
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState<Collector | null>(null);
  const { handleExport, exportInProgress } = useCollectorExport();
  
  const handleMessageClick = (collector: Collector) => {
    // If onAction returns true, we don't proceed
    if (onAction && onAction("message_collector") === true) {
      return;
    }
    
    setSelectedCollector(collector);
    setMessageModalOpen(true);
  };
  
  const handleExportClick = () => {
    // If onAction returns true, we don't proceed
    if (onAction && onAction("export_collectors") === true) {
      return;
    }
    
    // Call the export function from the hook
    const result = handleExport();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
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
          <Download className="h-4 w-4 mr-1" />
          {exportInProgress ? "Exporting..." : "Export"}
        </Button>
      </CardHeader>
      <CardContent>
        <CollectorTable 
          collectors={MOCK_COLLECTORS} 
          onMessageClick={handleMessageClick}
        />
      </CardContent>

      {selectedCollector && (
        <CollectorMessageModal 
          open={messageModalOpen} 
          onOpenChange={setMessageModalOpen}
          collector={selectedCollector}
        />
      )}
    </Card>
  );
};

export default MyCollectorsCard;

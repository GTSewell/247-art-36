
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, MessageCircle } from "lucide-react";
import InvoiceModal from "./InvoiceModal";

interface ActionButtonsProps {
  onAction: (actionName?: string) => boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAction }) => {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  
  const handleCreateInvoice = () => {
    // Check if we should block the action
    if (onAction("Create invoice")) {
      return; // Action was blocked
    }
    
    setInvoiceModalOpen(true);
  };
  
  const handleExportReports = () => {
    // Check if we should block the action
    if (onAction("Export reports")) {
      return; // Action was blocked
    }
    
    console.log("Export reports clicked");
    // Implement the export functionality here
  };
  
  const handleSupportChat = () => {
    // Check if we should block the action
    if (onAction("Contact support")) {
      return; // Action was blocked
    }
    
    console.log("Support chat clicked");
    // Implement support chat functionality here
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-20"
        onClick={handleCreateInvoice}
      >
        <FileText className="h-5 w-5 mb-1" />
        <span className="text-xs">Create Invoice</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-20"
        onClick={handleExportReports}
      >
        <Download className="h-5 w-5 mb-1" />
        <span className="text-xs">Export Reports</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-20"
        onClick={handleSupportChat}
      >
        <MessageCircle className="h-5 w-5 mb-1" />
        <span className="text-xs">Contact Support</span>
      </Button>
      
      <InvoiceModal
        open={invoiceModalOpen}
        onOpenChange={setInvoiceModalOpen}
      />
    </div>
  );
};

export default ActionButtons;

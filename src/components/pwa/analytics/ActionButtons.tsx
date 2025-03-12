
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  FileText,
  Mail,
  Printer,
  Share2,
  PlusCircle,
} from "lucide-react";
import InvoiceModal from "./InvoiceModal";
import { toast } from "sonner";

interface ActionButtonsProps {
  onAction?: (actionName?: string) => boolean | void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAction }) => {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const handleAction = (action: string) => {
    // If onAction handler returns false, we proceed with the action
    // If it returns true (or anything else), we stop
    if (onAction && onAction(action) === true) {
      return;
    }

    switch (action) {
      case "create_invoice":
        setInvoiceModalOpen(true);
        break;
      case "export_data":
        toast.success("Data exported successfully");
        break;
      case "print_report":
        toast.info("Preparing print view...");
        setTimeout(() => {
          window.print();
        }, 500);
        break;
      case "share_report":
        if (navigator.share) {
          navigator
            .share({
              title: "Sales Analytics",
              text: "Check out my latest sales analytics from 247.art",
              url: window.location.href,
            })
            .then(() => toast.success("Shared successfully"))
            .catch(() => toast.error("Share was cancelled or failed"));
        } else {
          toast.info("Web Share API not supported in this browser");
          // Fallback to copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard");
        }
        break;
      case "bulk_message":
        toast.info("Bulk message feature will open here");
        break;
      default:
        break;
    }
  };

  // Create empty mock invoice data for demo
  const mockInvoiceData = {
    id: "INV-2023-001",
    dateIssued: new Date().toISOString(),
    dateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    artist: {
      name: "Demo Artist",
      address: "123 Art Street, New York, NY 10001",
      email: "demo@247.art",
      phone: "+1 (555) 123-4567",
    },
    customer: {
      name: "Art Collector",
      address: "456 Gallery Ave, San Francisco, CA 94103",
      email: "collector@example.com",
    },
    items: [
      {
        description: "Original Artwork - 'Abstract Vision #12'",
        quantity: 1,
        unitPrice: 1200,
        total: 1200,
      },
      {
        description: "Limited Edition Print - Series #5",
        quantity: 2,
        unitPrice: 350,
        total: 700,
      },
    ],
    subtotal: 1900,
    taxRate: 8.5,
    taxAmount: 161.5,
    total: 2061.5,
    notes: "Thank you for your purchase. Payment due within 30 days.",
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleAction("create_invoice")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleAction("export_data")}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export Data
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleAction("print_report")}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => handleAction("share_report")}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Report
        </Button>
        <Button
          variant="outline"
          className="justify-start col-span-2"
          onClick={() => handleAction("bulk_message")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Message Collectors
        </Button>
      </div>

      <InvoiceModal
        open={invoiceModalOpen}
        onOpenChange={setInvoiceModalOpen}
        invoiceData={mockInvoiceData}
      />
    </div>
  );
};

export default ActionButtons;

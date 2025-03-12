
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import InvoiceModal from "./InvoiceModal";

const ActionButtons: React.FC = () => {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  
  // This data would typically come from your API or state management
  const invoiceData = {
    artistName: "GT Sewell",
    lineItems: [
      { quantity: 1, title: "Abstract 1", type: "Original artworks", unitPrice: 1650.00 },
      { quantity: 1, title: "Abstract 2", type: "Original artworks", unitPrice: 1000.00 },
      { quantity: 20, title: "Abstract 1", type: "Fine Art Print (A4)", unitPrice: 25.00 },
      { quantity: 8, title: "Abstract 1", type: "T-shirt", unitPrice: 22.50 },
      { quantity: 5, title: "Abstract 2", type: "Art Poster", unitPrice: 18.00 },
    ],
    totalAmount: 3420.00
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" /> 
          Export Analytics Report
        </Button>
        <Button 
          className="w-full md:w-auto bg-green-500 hover:bg-green-600" 
          onClick={() => setInvoiceModalOpen(true)}
        >
          <Mail className="mr-2 h-4 w-4" />
          Generate & Send Invoice
        </Button>
      </div>
      
      <InvoiceModal 
        open={invoiceModalOpen} 
        onOpenChange={setInvoiceModalOpen} 
        invoiceData={invoiceData} 
      />
    </>
  );
};

export default ActionButtons;


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ZoomControls from "./invoice/ZoomControls";
import InvoiceDocument from "./invoice/InvoiceDocument";
import InvoiceActions from "./invoice/InvoiceActions";

interface InvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: {
    artistName: string;
    lineItems: Array<{
      quantity: number;
      title: string;
      type: string;
      unitPrice: number;
    }>;
    totalAmount: number;
  };
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, onOpenChange, invoiceData }) => {
  const { toast } = useToast();
  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`;
  const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // State for bank details - changed from default values with instructions to empty strings
  const [bankName, setBankName] = useState("");
  const [bsb, setBsb] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  
  // State for zoom level - changed from 0.85 to 1.0 for 100% initial zoom
  const [zoomLevel, setZoomLevel] = useState(1.0);
  
  const handleSendInvoice = () => {
    toast({
      title: "Invoice sent successfully",
      description: "The invoice has been sent to 247art Pty Ltd",
    });
    onOpenChange(false);
  };
  
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2.0));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.6));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] h-[90vh] p-0 overflow-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">INVOICE</DialogTitle>
            <ZoomControls 
              zoomLevel={zoomLevel} 
              zoomIn={zoomIn} 
              zoomOut={zoomOut} 
            />
          </div>
        </DialogHeader>
        
        <div className="p-4 md:p-6 overflow-auto">
          <InvoiceDocument
            invoiceNumber={invoiceNumber}
            formattedDate={formattedDate}
            invoiceData={invoiceData}
            bankName={bankName}
            setBankName={setBankName}
            bsb={bsb}
            setBsb={setBsb}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            zoomLevel={zoomLevel}
          />
        </div>
        
        <InvoiceActions 
          onCancel={() => onOpenChange(false)} 
          onSend={handleSendInvoice} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;

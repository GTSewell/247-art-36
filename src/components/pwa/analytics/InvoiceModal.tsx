
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Printer, Check, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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
  
  // State for bank details
  const [bankName, setBankName] = useState("[Insert Bank Name]");
  const [bsb, setBsb] = useState("[Insert BSB]");
  const [accountNumber, setAccountNumber] = useState("[Insert Account Number]");
  
  // State for zoom level
  const [zoomLevel, setZoomLevel] = useState(1);
  
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
      <DialogContent className="max-w-[90vw] md:max-w-[80vw] h-[80vh] p-4 overflow-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-2">
          <DialogTitle className="text-2xl font-bold">INVOICE</DialogTitle>
          <div className="flex items-center gap-2 absolute right-10 top-0">
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div 
          className="space-y-6 mt-4"
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transformOrigin: 'top left',
            transition: 'transform 0.2s ease'
          }}
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">N. INVOICE</p>
              <p className="font-bold">{invoiceNumber}</p>
              <p className="font-medium mt-2">DATE</p>
              <p>{formattedDate}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-12 w-12">
                <div className="bg-muted rounded-full w-full h-full flex items-center justify-center">
                  <span className="text-lg font-medium">
                    {invoiceData.artistName.charAt(0)}
                  </span>
                </div>
              </Avatar>
              <div>
                <p className="font-bold">{invoiceData.artistName}</p>
              </div>
            </div>
          </div>
          
          {/* Bill To/From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="font-bold mb-2">BILL TO:</p>
              <p>247art Pty Ltd</p>
              <p>123 Art Way</p>
              <p>Sydney, NSW 2000</p>
              <p>admin@247art.com</p>
            </div>
            
            <div>
              <p className="font-bold mb-2">BILL FROM:</p>
              <p>{invoiceData.artistName}</p>
              <p>Artist Address</p>
              <p>artist@example.com</p>
            </div>
          </div>
          
          {/* Line Items */}
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-2 px-2 font-semibold">QTY</th>
                  <th className="text-left py-2 px-2 font-semibold">Title</th>
                  <th className="text-left py-2 px-2 font-semibold">Type</th>
                  <th className="text-right py-2 px-2 font-semibold">Unit $</th>
                  <th className="text-right py-2 px-2 font-semibold">Total $</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.lineItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-2">{item.quantity}</td>
                    <td className="py-2 px-2">{item.title}</td>
                    <td className="py-2 px-2">{item.type}</td>
                    <td className="py-2 px-2 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Total */}
          <div className="flex justify-end">
            <div className="w-full sm:w-1/3">
              <div className="flex justify-between py-2 border-t">
                <span className="font-semibold">TOTAL OWING:</span>
                <span className="font-bold">${invoiceData.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Info */}
          <div className="border rounded-md p-4 bg-muted/20">
            <p className="font-bold mb-2">Pay to:</p>
            <p>{invoiceData.artistName}</p>
            <div className="grid gap-2 mt-2">
              <div className="flex flex-col">
                <label htmlFor="bankName" className="text-sm text-muted-foreground">Bank Name:</label>
                <Input 
                  id="bankName"
                  value={bankName} 
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name"
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="bsb" className="text-sm text-muted-foreground">BSB:</label>
                <Input 
                  id="bsb"
                  value={bsb} 
                  onChange={(e) => setBsb(e.target.value)}
                  placeholder="Enter BSB"
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="accountNumber" className="text-sm text-muted-foreground">Account Number:</label>
                <Input 
                  id="accountNumber"
                  value={accountNumber} 
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          {/* Thank You */}
          <div className="text-center mt-6">
            <p className="font-bold text-lg">THANK YOU!</p>
            <p className="text-sm text-muted-foreground mt-1">For your business with 247.art</p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-wrap gap-2 mt-4 sticky bottom-0 bg-background pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleSendInvoice} className="gap-2">
            <Check className="h-4 w-4" />
            Proof & Send
            <Mail className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;

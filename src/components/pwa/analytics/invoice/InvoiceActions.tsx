
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Mail, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceActionsProps {
  onCancel: () => void;
  onSend: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ onCancel, onSend }) => {
  return (
    <DialogFooter className="sticky bottom-0 bg-background pt-2 p-4 border-t">
      <div className="w-full flex flex-col sm:flex-row gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button onClick={onSend} className="gap-2 bg-green-600 hover:bg-green-700">
          <Check className="h-4 w-4" />
          Proof & Send
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </DialogFooter>
  );
};

export default InvoiceActions;

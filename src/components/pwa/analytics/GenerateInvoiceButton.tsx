
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface GenerateInvoiceButtonProps {
  artistId: string | null;
  onGenerate: (artistId: string | null) => void;
}

const GenerateInvoiceButton: React.FC<GenerateInvoiceButtonProps> = ({ artistId, onGenerate }) => {
  return (
    <div className="mt-4">
      <Button 
        onClick={() => onGenerate(artistId)} 
        className="w-full bg-zap-red hover:bg-zap-blue"
      >
        <FileText className="mr-2 h-4 w-4" />
        Generate & Send Invoice
      </Button>
    </div>
  );
};

export default GenerateInvoiceButton;

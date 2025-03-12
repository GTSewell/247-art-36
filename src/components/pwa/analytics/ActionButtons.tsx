
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Mail, 
  Share2 
} from "lucide-react";

interface ActionButtonsProps {
  onAction?: () => boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAction }) => {
  const handleButtonClick = () => {
    if (onAction && onAction()) return;
    // Normal action logic would go here
  };

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <Button 
        onClick={handleButtonClick}
        variant="outline" 
        className="flex items-center justify-center h-20"
      >
        <div className="flex flex-col items-center">
          <Download className="h-6 w-6 mb-2" />
          <span>Export Data</span>
        </div>
      </Button>
      
      <Button 
        onClick={handleButtonClick}
        variant="outline" 
        className="flex items-center justify-center h-20"
      >
        <div className="flex flex-col items-center">
          <FileText className="h-6 w-6 mb-2" />
          <span>Create Invoice</span>
        </div>
      </Button>
      
      <Button 
        onClick={handleButtonClick}
        variant="outline" 
        className="flex items-center justify-center h-20"
      >
        <div className="flex flex-col items-center">
          <Mail className="h-6 w-6 mb-2" />
          <span>Email Campaign</span>
        </div>
      </Button>
      
      <Button 
        onClick={handleButtonClick}
        variant="outline" 
        className="flex items-center justify-center h-20"
      >
        <div className="flex flex-col items-center">
          <Share2 className="h-6 w-6 mb-2" />
          <span>Share Report</span>
        </div>
      </Button>
    </div>
  );
};

export default ActionButtons;

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <ExternalLink className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-foreground mb-2">No links yet</h3>
      <p className="text-muted-foreground mb-4">
        Add your first link to get started
      </p>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add your first link
      </Button>
    </div>
  );
};
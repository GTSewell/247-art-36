import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { AutoProfileActionsProps } from "./types";

const AutoProfileActions: React.FC<AutoProfileActionsProps> = ({
  onGenerate,
  onCancel,
  isGenerating,
  generationProgress
}) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex-1"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {generationProgress || 'Generating...'}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Enhanced Profile
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isGenerating}
      >
        Cancel
      </Button>
    </div>
  );
};

export default AutoProfileActions;
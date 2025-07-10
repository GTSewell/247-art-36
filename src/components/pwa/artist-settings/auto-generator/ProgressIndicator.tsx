import React from "react";
import { ProgressIndicatorProps } from "./types";

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isGenerating,
  generationProgress,
  currentStep,
  totalSteps
}) => {
  if (!isGenerating) return null;

  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {generationProgress}
        </span>
        <span className="text-xs text-muted-foreground">
          {currentStep}/{totalSteps}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;

import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-zap-blue" />
      <p className="text-lg font-medium">Generating product images...</p>
      <p className="text-sm text-gray-500">This may take a minute to complete</p>
    </div>
  );
};

export default LoadingState;

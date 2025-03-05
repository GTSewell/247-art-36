
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  backgroundColor: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ backgroundColor }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-3" style={{ backgroundColor }}>
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-lg font-medium">Loading artist profile...</p>
    </div>
  );
};

export default LoadingState;

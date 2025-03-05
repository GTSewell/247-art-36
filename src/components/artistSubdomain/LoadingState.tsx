
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  backgroundColor: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ backgroundColor }) => {
  return (
    <div 
      className="flex flex-col justify-center items-center min-h-screen gap-3" 
      style={{ 
        backgroundColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="bg-white/90 p-6 rounded-lg shadow-lg backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
        <p className="text-lg font-medium text-center">Loading artist profile...</p>
      </div>
    </div>
  );
};

export default LoadingState;

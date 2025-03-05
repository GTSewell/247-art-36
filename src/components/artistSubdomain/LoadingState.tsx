
import React from 'react';

interface LoadingStateProps {
  backgroundColor: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ backgroundColor }) => {
  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor }}>
      <p className="text-lg">Loading artist profile...</p>
    </div>
  );
};

export default LoadingState;

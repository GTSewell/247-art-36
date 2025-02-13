
import React from 'react';

interface MatterportViewerProps {
  modelId: string;
  width?: string;
  height?: string;
}

const MatterportViewer: React.FC<MatterportViewerProps> = ({ 
  modelId,
  width = '100%',
  height = '600px'
}) => {
  return (
    <div className="w-full h-full">
      <iframe
        width={width}
        height={height}
        src={`https://my.matterport.com/show/?m=${modelId}`}
        frameBorder="0"
        allowFullScreen
        allow="xr-spatial-tracking"
        className="w-full h-full"
      />
    </div>
  );
};

export default MatterportViewer;

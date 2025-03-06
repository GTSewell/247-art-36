
import React from 'react';

interface MobilePanelProps {
  children: React.ReactNode;
  panelHeight: string;
  panelColor: string;
}

const MobilePanel: React.FC<MobilePanelProps> = ({
  children,
  panelHeight,
  panelColor
}) => {
  return (
    <div 
      className="overflow-hidden shadow-lg w-full mx-auto my-2" 
      style={{ 
        backgroundColor: panelColor,
        height: panelHeight,
        borderRadius: '0.5rem',
        width: 'calc(100% - 16px)', // Account for the carousel padding
      }}
    >
      {children}
    </div>
  );
};

export default MobilePanel;


import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileNavigationProps {
  name: string;
  backgroundColor?: string;
  textColor?: string;
  onBack?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  name, 
  backgroundColor = 'transparent',
  textColor = 'black',
  onBack
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 z-50"
      style={{ backgroundColor: backgroundColor }}
    >
      <button 
        onClick={handleBack}
        className="mr-4 p-2 rounded-full hover:bg-black/10 transition-colors"
      >
        <ChevronLeft size={24} style={{ color: textColor }} />
      </button>
      <h1 
        className="text-lg font-medium truncate" 
        style={{ color: textColor }}
      >
        {name}
      </h1>
    </div>
  );
};

export default MobileNavigation;

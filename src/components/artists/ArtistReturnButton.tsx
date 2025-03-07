
import React from 'react';
import { ArrowLeftCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtistReturnButtonProps {
  onReturn: () => void;
  colorTheme?: {
    buttonBorder?: string;
  };
  showReturnButton: boolean;
}

const ArtistReturnButton: React.FC<ArtistReturnButtonProps> = ({ 
  onReturn, 
  colorTheme, 
  showReturnButton 
}) => {
  if (!showReturnButton) return null;
  
  return (
    <div className="absolute top-3 right-3 z-10">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onReturn}
        className="bg-white/80 hover:bg-white backdrop-blur-sm"
        style={{ borderColor: colorTheme?.buttonBorder }}
      >
        <ArrowLeftCircle size={18} />
        <span className="sr-only">Return to Artists</span>
      </Button>
    </div>
  );
};

export default ArtistReturnButton;

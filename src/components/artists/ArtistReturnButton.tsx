
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ArtistReturnButtonProps {
  textColor?: string;
  onClick?: () => void;
}

const ArtistReturnButton: React.FC<ArtistReturnButtonProps> = ({ 
  textColor = 'black',
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="hover:bg-black/10 transition-colors flex items-center mb-4"
      onClick={handleClick}
      style={{ color: textColor }}
    >
      <ChevronLeft className="mr-1" size={16} />
      Back
    </Button>
  );
};

export default ArtistReturnButton;

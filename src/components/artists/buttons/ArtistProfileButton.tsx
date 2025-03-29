import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/utils/logger';
import { useNavigate } from 'react-router-dom';

interface ArtistProfileButtonProps {
  formattedDomain: string;
  handleDomainClick?: (e: React.MouseEvent) => void;
}

const ArtistProfileButton: React.FC<ArtistProfileButtonProps> = ({
  formattedDomain,
  handleDomainClick,
}) => {
  const navigate = useNavigate();
  
  // Set zap blue for the artist profile button (visit button) - always blue
  const zapBlue = '#00baef';
  const visitButtonStyles = {
    backgroundColor: zapBlue,
    color: 'white',
    borderColor: 'transparent',
    height: '40px'
  };

  const handleVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logger.info(`Visit artist button clicked: ${formattedDomain}`);
    
    if (handleDomainClick) {
      // Use the provided click handler if available
      handleDomainClick(e);
    } else {
      // Otherwise, navigate programmatically to the artist profile page
      logger.info(`Navigating to artist profile: ${formattedDomain}`);
      navigate(`/artists/${formattedDomain}`);
    }
  };

  return (
    <Button
      variant="default"
      className="flex-1"
      style={visitButtonStyles}
      onClick={handleVisitClick}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#0095c0';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = zapBlue;
      }}
    >
      <div className="flex items-center justify-center gap-1">
        <span>Artist Profile</span>
        <ExternalLink size={16} />
      </div>
    </Button>
  );
};

export default ArtistProfileButton;

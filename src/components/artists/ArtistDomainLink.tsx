
import React from 'react';
import { LinkIcon } from 'lucide-react';
import { logger } from '@/utils/logger';

interface ArtistDomainLinkProps {
  artistDomain: string;
  handleDomainClick: (e: React.MouseEvent) => void;
}

const ArtistDomainLink: React.FC<ArtistDomainLinkProps> = ({ 
  artistDomain, 
  handleDomainClick 
}) => {
  // Clean up domain name to match what's used in the URL
  const formattedDomain = artistDomain
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^\w]/g, ''); // Remove special characters
    
  // Log the formatted domain for debugging
  React.useEffect(() => {
    logger.info(`Formatted artist domain: ${formattedDomain}`);
  }, [formattedDomain]);
  
  return (
    <div className="flex-none mb-3 flex items-center text-sm">
      <LinkIcon size={14} className="mr-1" />
      <button 
        onClick={handleDomainClick}
        className="text-black/70 hover:text-black font-mono truncate"
      >
        247.art/{formattedDomain}
      </button>
    </div>
  );
};

export default ArtistDomainLink;


import React from 'react';
import { LinkIcon } from 'lucide-react';

interface ArtistDomainLinkProps {
  artistDomain: string;
  handleDomainClick: (e: React.MouseEvent) => void;
}

const ArtistDomainLink: React.FC<ArtistDomainLinkProps> = ({ 
  artistDomain, 
  handleDomainClick 
}) => {
  // Format the artist name for the URL - remove spaces and special characters
  const formattedDomain = artistDomain.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();
  
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

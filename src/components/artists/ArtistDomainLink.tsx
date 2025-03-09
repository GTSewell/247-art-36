
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
  return (
    <div className="flex-none mb-3 flex items-center text-sm">
      <LinkIcon size={14} className="mr-1" />
      <button 
        onClick={handleDomainClick}
        className="text-black/70 hover:text-black font-mono truncate"
      >
        {`${artistDomain}.247.art`}
      </button>
    </div>
  );
};

export default ArtistDomainLink;

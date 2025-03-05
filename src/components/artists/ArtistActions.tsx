
import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtistActionsProps {
  domainName: string;
  artistId: number;
  isFavorite: boolean;
  onFavoriteToggle?: (artistId: number, isFavorite: boolean) => void;
  handleDomainClick: (e: React.MouseEvent) => void;
}

const ArtistActions: React.FC<ArtistActionsProps> = ({ 
  domainName, 
  artistId, 
  isFavorite, 
  onFavoriteToggle,
  handleDomainClick
}) => {
  return (
    <div className="space-y-3 absolute bottom-5 md:bottom-5 left-5 right-5 pt-2">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleDomainClick}
          className="flex-1 bg-[#00baef] hover:bg-[#00a6d6] text-white"
        >
          {domainName}.247.art
          <ExternalLink className="ml-1" size={16} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            if (onFavoriteToggle) {
              onFavoriteToggle(artistId, !isFavorite);
            }
          }}
          className={`${
            isFavorite 
              ? 'bg-[#f7cf1e] text-black hover:bg-[#f7cf1e]' 
              : 'bg-gray-200 hover:bg-[#f7cf1e] hover:text-black text-gray-700'
          }`}
        >
          <Zap size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ArtistActions;

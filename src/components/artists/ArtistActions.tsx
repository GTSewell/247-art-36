
import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const handleSubdomainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/artist/${domainName}`);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSubdomainClick}
          className="flex-1 bg-[#00baef] hover:bg-[#00a6d6] text-white"
        >
          247.art/{domainName}
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

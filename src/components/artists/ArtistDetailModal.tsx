
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ArtistModalContent from './ArtistModalContent';
import { Artist } from '@/data/types/artist';
import { Badge } from '@/components/ui/badge';

interface ArtistDetailModalProps {
  artists: Artist[];
  selectedArtist: Artist | null;
  selectedArtistIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArtistChange: (index: number) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  onSelect: (artist: Artist) => void;
}

const ArtistDetailModal: React.FC<ArtistDetailModalProps> = ({
  artists,
  selectedArtist,
  selectedArtistIndex,
  open,
  onOpenChange,
  onArtistChange,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtists,
  onSelect
}) => {
  if (!selectedArtist) return null;

  // Check if artist is a Signature Artist (ID >= 26)
  const isSignatureArtist = selectedArtist.id >= 26;
  
  // Check if artist should have a Demo badge (not signature artist and not ID 24)
  const isDemoArtist = selectedArtist.id < 26 && selectedArtist.id !== 24;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pr-8">
          <div className="flex items-center gap-2">
            <DialogTitle>{selectedArtist.name}</DialogTitle>
            
            {/* Signature Artist Badge */}
            {isSignatureArtist && (
              <Badge className="bg-zap-red text-[#333333] font-bold">
                Signature Artist
              </Badge>
            )}
            
            {/* Demo Artist Badge */}
            {isDemoArtist && (
              <Badge className="bg-zap-blue text-white font-bold">
                Demo
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <div className={`rounded-lg overflow-hidden ${isSignatureArtist ? 'border-2 border-zap-yellow' : ''}`}>
          <ArtistModalContent
            artists={artists}
            selectedArtistIndex={selectedArtistIndex}
            onArtistChange={onArtistChange}
            onFavoriteToggle={onFavoriteToggle}
            favoriteArtists={favoriteArtists}
            refreshArtists={refreshArtists}
            onSelect={onSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistDetailModal;

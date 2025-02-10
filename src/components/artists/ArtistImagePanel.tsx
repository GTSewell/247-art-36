
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtistImagePanelProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
}

const ArtistImagePanel: React.FC<ArtistImagePanelProps> = ({ 
  artist, 
  onFavoriteToggle, 
  isFavorite 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="space-y-3">
      <div 
        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
      >
        <AnimatePresence initial={false} mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.4 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute w-full h-full"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -90 }}
              transition={{ duration: 0.4 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute w-full h-full bg-white"
            >
              <div className="grid grid-cols-2 gap-2 p-2 w-full h-full">
                {artist.artworks?.slice(0, 4).map((artwork, index) => (
                  <div key={index} className="relative aspect-square rounded overflow-hidden">
                    <img
                      src={artwork}
                      alt={`Artwork ${index + 1} by ${artist.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {(!artist.artworks || artist.artworks.length === 0) && (
                  <div className="col-span-2 flex items-center justify-center h-full text-gray-500 text-sm italic">
                    No artworks available
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtistImagePanel;


import React, { useState, useEffect } from 'react';
import { MousePointerClick } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [isHovered, setIsHovered] = useState(false);
  const [showClickIndicator, setShowClickIndicator] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const hasFlipped = localStorage.getItem(`flipped-${artist.id}`);
    if (hasFlipped) {
      setShowClickIndicator(false);
    }
  }, [artist.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (showClickIndicator) {
      setShowClickIndicator(false);
      localStorage.setItem(`flipped-${artist.id}`, 'true');
    }
  };

  const handleInteraction = () => {
    if (isMobile) {
      setIsHovered(true);
      // Auto-hide the indicator after 3 seconds on mobile
      setTimeout(() => {
        setIsHovered(false);
      }, 3000);
    }
  };

  return (
    <div className="space-y-3">
      <div 
        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleInteraction}
      >
        <AnimatePresence>
          {showClickIndicator && (isHovered || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute bottom-4 right-4 flex items-center justify-center bg-black/50 p-2 rounded-full z-10"
            >
              <MousePointerClick className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

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


import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArtistArtworksView } from './ArtistArtworksView';
import { ClickIndicator } from './ClickIndicator';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

interface ArtistImagePanelProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
  refreshArtists?: () => void;
}

const ArtistImagePanel: React.FC<ArtistImagePanelProps> = ({ 
  artist, 
  onFavoriteToggle, 
  isFavorite,
  refreshArtists
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showClickIndicator, setShowClickIndicator] = useState(true);
  const [mainImageError, setMainImageError] = useState(false);
  const [artworkErrors, setArtworkErrors] = useState<Record<number, boolean>>({});
  const [isGeneratingArtworks, setIsGeneratingArtworks] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<Artist>(artist);
  const isMobile = useIsMobile();

  // Log artworks info for debugging
  useEffect(() => {
    const artworks = Array.isArray(artist.artworks) 
      ? artist.artworks 
      : typeof artist.artworks === 'string' && artist.artworks
        ? JSON.parse(artist.artworks)
        : [];
    
    logger.info(`ArtistImagePanel - Artist ID: ${artist.id}, Artworks count: ${artworks.length}`);
  }, [artist]);

  useEffect(() => {
    setCurrentArtist(artist);
  }, [artist]);

  useEffect(() => {
    const hasFlipped = localStorage.getItem(`flipped-${artist.id}`);
    if (hasFlipped) {
      setShowClickIndicator(false);
    }
  }, [artist.id]);

  // This function determines if a click should flip the card or not
  const handleFlip = (e: React.MouseEvent) => {
    // Check if click originated from a button or interactive element
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.tagName === 'BUTTON' || 
      target.closest('button') ||
      target.closest('[data-button-container="true"]') ||
      target.getAttribute('data-button-container') === 'true' ||
      target.closest('[data-no-flip="true"]') ||
      target.getAttribute('data-no-flip') === 'true';
    
    // Don't flip if clicking on a button or if we're in the middle of an operation
    if (isInteractiveElement || isGeneratingArtworks) {
      return;
    }
    
    logger.info(`Flipping card for artist ${artist.id} from ${isFlipped ? 'back' : 'front'} to ${isFlipped ? 'front' : 'back'}`);
    setIsFlipped(!isFlipped);
    if (showClickIndicator) {
      setShowClickIndicator(false);
      localStorage.setItem(`flipped-${artist.id}`, 'true');
    }
  };

  const handleInteraction = () => {
    if (isMobile) {
      setIsHovered(true);
      if (showClickIndicator) {
        setShowClickIndicator(false);
        localStorage.setItem(`flipped-${artist.id}`, 'true');
      }
      setTimeout(() => {
        setIsHovered(false);
      }, 3000);
    }
  };

  const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error("Main image failed to load:", artist.image);
    setMainImageError(true);
    e.currentTarget.src = '/placeholder.svg';
  };

  const handleArtworkImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    logger.error(`Artwork image ${index} failed to load:`, artist.artworks?.[index]);
    setArtworkErrors(prev => ({ ...prev, [index]: true }));
    e.currentTarget.src = '/placeholder.svg';
  };

  const refreshArtist = async () => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artist.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setCurrentArtist(data as Artist);
        
        // If parent component has a refresh function, call it too
        if (refreshArtists) {
          refreshArtists();
        }
      }
    } catch (error) {
      logger.error('Error refreshing artist data:', error);
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px]">
      <div 
        className="relative aspect-auto md:aspect-square h-full w-full overflow-hidden cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleInteraction}
      >
        <AnimatePresence>
          <ClickIndicator 
            showClickIndicator={showClickIndicator}
            isHovered={isHovered}
            isMobile={isMobile}
          />
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
                src={mainImageError ? '/placeholder.svg' : currentArtist.image}
                alt={currentArtist.name}
                className="w-full h-full object-cover"
                onError={handleMainImageError}
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
              <div className="h-full w-full">
                <ArtistArtworksView 
                  artist={currentArtist}
                  isGeneratingArtworks={isGeneratingArtworks}
                  setIsGeneratingArtworks={setIsGeneratingArtworks}
                  artworkErrors={artworkErrors}
                  handleArtworkImageError={handleArtworkImageError}
                  refreshArtworks={refreshArtist}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtistImagePanel;

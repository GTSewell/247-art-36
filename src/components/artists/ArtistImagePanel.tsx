
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArtistImageButtons } from './ArtistImageButtons';
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [isGeneratingArtworks, setIsGeneratingArtworks] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<Artist>(artist);
  const isMobile = useIsMobile();

  useEffect(() => {
    setCurrentArtist(artist);
  }, [artist]);

  useEffect(() => {
    const hasFlipped = localStorage.getItem(`flipped-${artist.id}`);
    if (hasFlipped) {
      setShowClickIndicator(false);
    }
  }, [artist.id]);

  const handleFlip = (e: React.MouseEvent) => {
    logger.info(`Flip attempt for artist ${artist.id}`, {
      isGeneratingImage,
      isSavingImage,
      isGeneratingArtworks,
      targetIsButton: e.target instanceof HTMLButtonElement
    });
    
    // Don't flip if the click came from a button or during generation processes
    if (
      e.target instanceof HTMLButtonElement || 
      isGeneratingImage || 
      isSavingImage || 
      isGeneratingArtworks ||
      // Also check for clicking within button container divs
      (e.target instanceof HTMLElement && 
       (e.target.closest('button') || e.target.closest('[role="button"]')))
    ) {
      logger.info('Flip prevented - clicked on button or in processing state');
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
    <div className="space-y-3">
      <div 
        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleInteraction}
      >
        {/* Generate & Save buttons */}
        <ArtistImageButtons 
          artist={currentArtist}
          isGeneratingImage={isGeneratingImage}
          isSavingImage={isSavingImage}
          setIsGeneratingImage={setIsGeneratingImage}
          setIsSavingImage={setIsSavingImage}
          refreshArtist={refreshArtist}
        />

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
              <ArtistArtworksView 
                artist={currentArtist}
                isGeneratingArtworks={isGeneratingArtworks}
                setIsGeneratingArtworks={setIsGeneratingArtworks}
                artworkErrors={artworkErrors}
                handleArtworkImageError={handleArtworkImageError}
                refreshArtworks={refreshArtist}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtistImagePanel;

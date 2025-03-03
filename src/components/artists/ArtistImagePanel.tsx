
import React, { useState, useEffect } from 'react';
import { MousePointerClick, Wand, Save } from 'lucide-react';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ArtistImagePanelProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
}

const ArtistImagePanel: React.FC<ArtistImagePanelProps> = ({ 
  artist, 
  onFavoriteToggle, 
  isFavorite,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showClickIndicator, setShowClickIndicator] = useState(true);
  const [mainImageError, setMainImageError] = useState(false);
  const [artworkErrors, setArtworkErrors] = useState<Record<number, boolean>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [isGeneratingArtworks, setIsGeneratingArtworks] = useState(false);
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
    console.log("Main image failed to load:", artist.image);
    setMainImageError(true);
    e.currentTarget.src = '/placeholder.svg';
  };

  const handleArtworkImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    console.log(`Artwork image ${index} failed to load:`, artist.artworks?.[index]);
    setArtworkErrors(prev => ({ ...prev, [index]: true }));
    e.currentTarget.src = '/placeholder.svg';
  };

  const handleGenerateArtistImage = async () => {
    setIsGeneratingImage(true);
    try {
      const prompt = `Professional portrait photograph of a ${artist.specialty} artist named ${artist.name} from ${artist.city || ''} ${artist.country || ''}. ${artist.bio || ''}`;
      
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { artist_id: artist.id, prompt }
      });
      
      if (error) throw error;
      
      toast.success('Artist image generated successfully!');
      // Force reload to show the new temp image
      window.location.reload();
    } catch (error) {
      console.error('Error generating artist image:', error);
      toast.error('Failed to generate artist image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveArtistImage = async () => {
    setIsSavingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id, 
          save: true,
          download_image: true // New flag to indicate we want to download and store the image
        }
      });
      
      if (error) throw error;
      
      toast.success('Artist image saved to Supabase storage!');
      // Force reload to show the saved image
      window.location.reload();
    } catch (error) {
      console.error('Error saving artist image:', error);
      toast.error('Failed to save artist image');
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleGenerateArtworks = async () => {
    setIsGeneratingArtworks(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id, 
          generate_artworks: true,
          count: 4,
          download_images: true // New flag to indicate we want to download and store the artworks
        }
      });
      
      if (error) throw error;
      
      toast.success('Artworks generated and saved to storage!');
      // Force reload to show the new artworks
      window.location.reload();
    } catch (error) {
      console.error('Error generating artworks:', error);
      toast.error('Failed to generate artworks');
    } finally {
      setIsGeneratingArtworks(false);
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
        <div className="absolute top-2 left-2 right-2 z-20 flex gap-2 justify-between">
          <Button
            size="sm"
            variant="outline"
            className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/60"
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateArtistImage();
            }}
            disabled={isGeneratingImage}
          >
            <Wand className={`h-4 w-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
            {isGeneratingImage ? 'Generating...' : 'Generate'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/60"
            onClick={(e) => {
              e.stopPropagation();
              handleSaveArtistImage();
            }}
            disabled={isSavingImage}
          >
            <Save className="h-4 w-4" />
            {isSavingImage ? 'Saving...' : 'Save'}
          </Button>
        </div>

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
              className="absolute bottom-4 right-4 flex items-center justify-center bg-[#0EA5E9]/90 p-2 rounded-full z-10 shadow-lg"
            >
              <MousePointerClick className="w-6 h-6 text-white animate-pulse" />
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
                src={mainImageError ? '/placeholder.svg' : artist.image}
                alt={artist.name}
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
              <div className="relative h-full">
                {/* Generate Artworks button */}
                <div className="absolute top-2 left-2 right-2 z-20 flex justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateArtworks();
                    }}
                    disabled={isGeneratingArtworks}
                  >
                    <Wand className={`h-4 w-4 ${isGeneratingArtworks ? 'animate-spin' : ''}`} />
                    {isGeneratingArtworks ? 'Generating...' : 'Generate Artworks'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 p-2 w-full h-full">
                  {Array.isArray(artist.artworks) && artist.artworks.length > 0 ? (
                    artist.artworks.slice(0, 4).map((artwork, index) => (
                      <div key={index} className="relative aspect-square rounded overflow-hidden">
                        <img
                          src={artworkErrors[index] ? '/placeholder.svg' : artwork}
                          alt={`Artwork ${index + 1} by ${artist.name}`}
                          className="w-full h-full object-cover"
                          onError={(e) => handleArtworkImageError(e, index)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex items-center justify-center h-full text-gray-500 text-sm italic">
                      No artworks available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtistImagePanel;

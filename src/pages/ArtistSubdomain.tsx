
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useArtistData } from '@/components/artistSubdomain/useArtistData';
import LoadingState from '@/components/artistSubdomain/LoadingState';
import NotFoundState from '@/components/artistSubdomain/NotFoundState';
import DesktopLayout from '@/components/artistSubdomain/DesktopLayout';
import MobileLayout from '@/components/artistSubdomain/MobileLayout';
import { useColorTheme } from '@/hooks/useColorTheme';
import { defaultColorThemes } from '@/utils/colorExtraction';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { ensureArray } from '@/utils/ensureArray';

const ArtistSubdomain = () => {
  const { artistName } = useParams<{ artistName: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Only proceed with getArtistData if artistName exists
  const { artist, profile, loading, getArtistData } = useArtistData(
    artistName && artistName.trim() !== '' ? artistName : undefined
  );

  // Generate color theme using the hook - must be called before any early returns
  const { colorTheme: generatedColorTheme } = useColorTheme(artist, profile, artist ? ensureArray((getArtistData()?.artworks || [])) : []);

  useEffect(() => {
    // Check if artistName exists and is not empty
    if (artistName && artistName.trim() !== '') {
      logger.info(`ArtistSubdomain mounted for artist: ${artistName}`);
    } else {
      logger.error('ArtistSubdomain mounted without an artist name');
      toast.error('No artist name provided');
      // If no artist name is provided, redirect to artists page with a short delay
      const timeout = setTimeout(() => {
        navigate('/artists');
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [artistName, navigate]);

  // Show loading state while data is being fetched
  if (loading) {
    return <LoadingState backgroundColor={profile?.background_color || '#e5d0b9'} />;
  }

  // Show not found state if there's no artist name or no artist found
  if (!artistName || !artist) {
    return <NotFoundState artistName={artistName} />;
  }

  const { techniques, styles, socialPlatforms, artworks } = getArtistData();
  const parsedTechniques = ensureArray(techniques);
  const parsedStyles = ensureArray(styles);
  const parsedSocialPlatforms = ensureArray(socialPlatforms);
  const parsedArtworks = ensureArray(artworks);
  
  // Get background image from artwork_files if available
  let backgroundImage = null;
  if (artist.artwork_files && 
      typeof artist.artwork_files === 'object' && 
      'background_image' in artist.artwork_files && 
      artist.artwork_files.background_image) {
    backgroundImage = artist.artwork_files.background_image;
    logger.info(`Using explicitly set background image: ${backgroundImage}`);
  }
  
  // Use custom color theme for Demo Artist, otherwise use the generated theme
  const customColorTheme = artistName.toLowerCase() === 'demo artist' ? {
    background: '#e5d0b9', // Beige/tan background
    panel: '#FEF9F4',      // Off-white panel
    button: '#95B3D2',     // Blue button
    buttonText: '#ffffff', // White text
    buttonHover: '#7A9CC2',// Darker blue on hover
    buttonBorder: '#95B3D2',// Blue border
    badgeBg: '#f7f4f0'     // Light beige badge
  } : generatedColorTheme;

  return isMobile ? (
    <MobileLayout
      artist={artist}
      profile={profile}
      techniques={parsedTechniques}
      styles={parsedStyles}
      socialPlatforms={parsedSocialPlatforms}
      artworks={parsedArtworks}
      colorTheme={customColorTheme}
      backgroundImage={backgroundImage}
    />
  ) : (
    <DesktopLayout
      artist={artist}
      profile={profile}
      techniques={parsedTechniques}
      styles={parsedStyles}
      socialPlatforms={parsedSocialPlatforms}
      artworks={parsedArtworks}
      colorTheme={customColorTheme}
      backgroundImage={backgroundImage}
    />
  );
};

export default ArtistSubdomain;


import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useArtistData } from '@/components/artistSubdomain/useArtistData';
import LoadingState from '@/components/artistSubdomain/LoadingState';
import NotFoundState from '@/components/artistSubdomain/NotFoundState';
import DesktopLayout from '@/components/artistSubdomain/DesktopLayout';
import MobileLayout from '@/components/artistSubdomain/MobileLayout';
import { generateColorTheme } from '@/utils/colorExtraction';
import { logger } from '@/utils/logger';

const ArtistSubdomain = () => {
  const { artistName } = useParams<{ artistName: string }>();
  const { artist, profile, loading, getArtistData } = useArtistData(artistName);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    // Log the artist name we're trying to fetch
    logger.info(`Attempting to load artist page for: ${artistName}`);
  }, [artistName]);

  if (loading) {
    return <LoadingState backgroundColor={profile?.background_color || '#f7cf1e'} />;
  }

  if (!artist) {
    logger.error(`Artist not found for slug: ${artistName}`);
    return <NotFoundState />;
  }

  const { techniques, styles, socialPlatforms, artworks } = getArtistData();
  
  // Generate color theme based on artist and artworks
  const colorTheme = generateColorTheme(artist, profile, artworks);

  return isMobile ? (
    <MobileLayout
      artist={artist}
      profile={profile}
      techniques={techniques}
      styles={styles}
      socialPlatforms={socialPlatforms}
      artworks={artworks}
      colorTheme={colorTheme}
    />
  ) : (
    <DesktopLayout
      artist={artist}
      profile={profile}
      techniques={techniques}
      styles={styles}
      socialPlatforms={socialPlatforms}
      artworks={artworks}
      colorTheme={colorTheme}
    />
  );
};

export default ArtistSubdomain;

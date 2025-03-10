
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
    if (artistName) {
      logger.info(`ArtistSubdomain mounted for artist: ${artistName}`);
    } else {
      logger.error('ArtistSubdomain mounted without an artist name');
    }
  }, [artistName]);

  useEffect(() => {
    if (!loading && !artist && artistName) {
      logger.error(`Artist not found: ${artistName}`);
    }
  }, [loading, artist, artistName]);

  // Show not found state if there's no artist name or no artist found
  if (!artistName || (!loading && !artist)) {
    return <NotFoundState />;
  }

  if (loading) {
    return <LoadingState backgroundColor={profile?.background_color || '#f7cf1e'} />;
  }

  if (!artist) {
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


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
  const navigate = useNavigate();
  const { artist, profile, loading, getArtistData } = useArtistData(artistName);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (artistName) {
      logger.info(`ArtistSubdomain mounted for artist: ${artistName}`);
    } else {
      logger.error('ArtistSubdomain mounted without an artist name');
      // If no artist name is provided, redirect to artists page
      navigate('/artists');
    }
  }, [artistName, navigate]);

  // Show loading state while data is being fetched
  if (loading) {
    return <LoadingState backgroundColor={profile?.background_color || '#f7cf1e'} />;
  }

  // Show not found state if there's no artist name or no artist found
  if (!artistName || !artist) {
    return <NotFoundState artistName={artistName} />;
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

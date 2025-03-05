
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useArtistData } from '@/components/artistSubdomain/useArtistData';
import LoadingState from '@/components/artistSubdomain/LoadingState';
import NotFoundState from '@/components/artistSubdomain/NotFoundState';
import DesktopLayout from '@/components/artistSubdomain/DesktopLayout';
import MobileLayout from '@/components/artistSubdomain/MobileLayout';
import { getArtistColorPalette } from '@/utils/colorExtraction';

const ArtistSubdomain = () => {
  const { artistName } = useParams<{ artistName: string }>();
  const { artist, profile, loading, getArtistData } = useArtistData(artistName);
  const isMobile = useIsMobile();

  // Get custom color palette for the artist
  const colorPalette = useMemo(() => {
    if (!artist) return { background: '#f7cf1e', panel: '#ffffff', text: '#000000', accent: '#ef3f36' };
    return getArtistColorPalette(artist);
  }, [artist]);

  if (loading) {
    return <LoadingState backgroundColor={colorPalette.background} />;
  }

  if (!artist) {
    return <NotFoundState />;
  }

  const { techniques, styles, socialPlatforms, artworks } = getArtistData();

  // Enhanced profile with custom colors
  const enhancedProfile = {
    ...profile,
    background_color: colorPalette.background,
    panel_color: colorPalette.panel,
    text_color: colorPalette.text,
    accent_color: colorPalette.accent
  };

  return isMobile ? (
    <MobileLayout
      artist={artist}
      profile={enhancedProfile}
      techniques={techniques}
      styles={styles}
      socialPlatforms={socialPlatforms}
      artworks={artworks}
    />
  ) : (
    <DesktopLayout
      artist={artist}
      profile={enhancedProfile}
      techniques={techniques}
      styles={styles}
      socialPlatforms={socialPlatforms}
      artworks={artworks}
    />
  );
};

export default ArtistSubdomain;

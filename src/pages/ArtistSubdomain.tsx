
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useArtistData } from '@/components/artistSubdomain/useArtistData';
import LoadingState from '@/components/artistSubdomain/LoadingState';
import NotFoundState from '@/components/artistSubdomain/NotFoundState';
import DesktopLayout from '@/components/artistSubdomain/DesktopLayout';
import MobileLayout from '@/components/artistSubdomain/MobileLayout';
import { generateColorTheme } from '@/utils/colorExtraction';
import { useAppMode } from '@/contexts/AppModeContext';

const ArtistSubdomain = () => {
  const { artistName } = useParams<{ artistName: string }>();
  const { artist, profile, loading, getArtistData } = useArtistData(artistName);
  const isMobile = useIsMobile();
  const { isPWA } = useAppMode();
  const navigate = useNavigate();

  // Custom back handler that takes into account the app mode
  const handleBack = () => {
    if (isPWA) {
      navigate('/artists');
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return <LoadingState backgroundColor={profile?.background_color || '#f7cf1e'} />;
  }

  if (!artist) {
    return <NotFoundState />;
  }

  const { techniques, styles, socialPlatforms, artworks } = getArtistData();
  
  // Generate color theme based on artist and artworks
  const colorTheme = generateColorTheme(artist, profile, artworks);

  // Pass the custom back handler to the layouts
  return isMobile ? (
    <MobileLayout
      artist={artist}
      profile={profile}
      techniques={techniques}
      styles={styles}
      socialPlatforms={socialPlatforms}
      artworks={artworks}
      colorTheme={colorTheme}
      onBack={handleBack}
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
      onBack={handleBack}
    />
  );
};

export default ArtistSubdomain;

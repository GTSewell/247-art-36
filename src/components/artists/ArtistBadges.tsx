
import React from 'react';

interface ArtistBadgesProps {
  isSignatureArtist: boolean;
  isDemo: boolean;
  position?: 'top-left' | 'top-right';
  isMobile?: boolean;
}

const ArtistBadges: React.FC<ArtistBadgesProps> = ({
  isSignatureArtist,
  isDemo,
  position = 'top-left',
  isMobile = false,
}) => {
  const positionClass = position === 'top-left' ? 'top-3 left-3' : 'top-3 right-3';

  return (
    <>
      {/* Signature Artist Badge */}
      {isSignatureArtist && (
        <div className={`absolute ${positionClass} z-10 bg-zap-red text-white font-bold text-lg shadow-md rounded-lg py-[2px] px-[10px]`}>
          Signature Artist
        </div>
      )}
      
      {/* Demo Badge - Added for artists that are not signature artists and should show the demo badge */}
      {!isSignatureArtist && isDemo && (
        <div className={`absolute ${positionClass} z-10 bg-[#00baef] text-white font-bold text-lg shadow-md rounded-lg py-[2px] px-[10px]`}>
          Demo
        </div>
      )}
    </>
  );
};

export default ArtistBadges;

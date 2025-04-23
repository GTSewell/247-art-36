
import React from 'react';

interface ArtistBadgesProps {
  isSignatureArtist: boolean;
  isDemo: boolean;
  position?: 'top-left' | 'top-right';
  isMobile?: boolean;
  overrideStyle?: boolean;
}

const ArtistBadges: React.FC<ArtistBadgesProps> = ({
  isSignatureArtist,
  isDemo,
  position = 'top-left',
  isMobile = false,
  overrideStyle = false,
}) => {
  // For mobile view with override style (positioned above modal)
  if (isMobile && overrideStyle) {
    return (
      <div className="flex flex-col items-center gap-2">
        {isSignatureArtist && (
          <div className="bg-zap-red text-white font-bold text-lg shadow-md rounded-lg py-1 px-3 z-50">
            Signature Artist
          </div>
        )}
        
        {!isSignatureArtist && isDemo && (
          <div className="bg-[#00baef] text-white font-bold text-lg shadow-md rounded-lg py-1 px-3 z-50">
            Demo
          </div>
        )}
      </div>
    );
  }
  
  // For mobile view within the modal (don't render)
  if (isMobile && !overrideStyle) {
    return null;
  }

  // For desktop view, keep the original positioning
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

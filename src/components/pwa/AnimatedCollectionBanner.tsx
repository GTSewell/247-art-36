
import React from 'react';
import { useAppMode } from '@/contexts/AppModeContext';

const AnimatedCollectionBanner: React.FC = () => {
  const { isPWA } = useAppMode();
  const categories = [
    'ORIGINAL ARTWORK',
    'SIGNED & NUMBERED',
    'STICKERS & FUN STUFF',
    'T-SHIRTS & APPAREL',
    'ART PRINTS & POSTERS',
    'THE 247 COLLECTION'
  ];

  return (
    <div className={`relative w-full overflow-hidden bg-white text-zap-red py-1 ${isPWA ? 'my-2' : 'my-6'} border-y-2 border-black`}>
      <div className="animate-marquee whitespace-nowrap inline-block">
        {[...Array(3)].map((_, i) => (
          <React.Fragment key={i}>
            {categories.map((category, index) => (
              <span key={`${i}-${index}`} className="mx-4 font-nove text-xl inline-flex items-center">
                {category} <span className="mx-2">⚡</span>
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCollectionBanner;


import React from 'react';
import { Pattern247Background } from './Pattern247Background';

export const PasswordGateLayeredBackground: React.FC = () => {
  return (
    <>
      {/* Base yellow background - z-0 */}
      <div className="absolute inset-0 bg-zap-yellow z-0" />
      
      {/* 247.ART pattern overlay - z-5 */}
      <Pattern247Background />
      
      {/* Halftone overlay - z-10 - replaced with new blue halftone */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `url('/lovable-uploads/08903113-968a-4ec9-828b-08adc61cd6d5.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'normal',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};


import React from 'react';
import { PasswordGateBackground } from './PasswordGateBackground';
import { Pattern247Background } from './Pattern247Background';

export const PasswordGateLayeredBackground: React.FC = () => {
  return (
    <>
      {/* Base yellow background - z-0 */}
      <div className="absolute inset-0 bg-zap-yellow z-0" />
      
      {/* 247.ART pattern overlay - z-5 */}
      <Pattern247Background />
      
      {/* Halftone overlay - z-10 */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `url('/lovable-uploads/e16074dd-11b0-4f2e-bcc8-06b5fa6c282a.png')`,
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

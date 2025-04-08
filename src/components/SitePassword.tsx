
import React from 'react';
import { PasswordForm } from './password/PasswordForm';
import { PasswordDisclaimer } from './password/PasswordDisclaimer';
import { PasswordPageLogo } from './password/PasswordPageLogo';
import { PasswordGateLayeredBackground } from './password/PasswordGateLayeredBackground';
import { ArtistEOIForm } from './password/ArtistEOIForm';

interface SitePasswordProps {
  setIsPasswordCorrect: (isCorrect: boolean) => void;
}

export const SitePassword: React.FC<SitePasswordProps> = ({ setIsPasswordCorrect }) => {
  return (
    <div className="min-h-screen overflow-auto py-10 flex flex-col items-center justify-center bg-zap-yellow relative">
      <PasswordGateLayeredBackground />
      
      <div className="relative z-20 w-full max-w-md bg-white rounded-lg shadow-xl p-8 mb-6">
        <PasswordPageLogo />
        
        <PasswordForm setIsPasswordCorrect={setIsPasswordCorrect} />
        
        <PasswordDisclaimer />
      </div>
      
      {/* Artist Expression of Interest Form */}
      <div className="relative z-20 w-full max-w-md mb-10">
        <ArtistEOIForm />
      </div>
    </div>
  );
};

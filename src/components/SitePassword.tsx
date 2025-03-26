
import React from 'react';
import { PasswordForm } from './password/PasswordForm';
import { PasswordDisclaimer } from './password/PasswordDisclaimer';
import { PasswordPageLogo } from './password/PasswordPageLogo';
import { PasswordPageBackground } from './password/PasswordPageBackground';
import { ArtistEOIForm } from './password/ArtistEOIForm';

interface SitePasswordProps {
  setIsPasswordCorrect: (isCorrect: boolean) => void;
}

export const SitePassword: React.FC<SitePasswordProps> = ({ setIsPasswordCorrect }) => {
  return (
    <div className="min-h-screen overflow-auto py-10 flex flex-col items-center justify-center bg-zap-yellow relative">
      <PasswordPageBackground />
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-8 mb-6">
        <PasswordPageLogo />
        
        <p className="mb-2 text-center text-gray-600">
          This site is password protected. Please enter the password to continue.
        </p>
        
        {/* Moved instruction text here, right after the main instruction and before the form */}
        <p className="mb-4 text-center font-bold text-black">
          If you need a password, please fill out the form below
        </p>
        
        <PasswordForm setIsPasswordCorrect={setIsPasswordCorrect} />
        
        <PasswordDisclaimer />
      </div>
      
      {/* Removed the previously added instruction div that was between the password form and the EOI form */}
      
      {/* Artist Expression of Interest Form */}
      <div className="relative z-10 w-full max-w-md mb-10">
        <ArtistEOIForm />
      </div>
    </div>
  );
};

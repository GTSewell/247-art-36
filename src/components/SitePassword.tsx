
import React from 'react';
import { PasswordForm } from './password/PasswordForm';
import { PasswordDisclaimer } from './password/PasswordDisclaimer';
import { PasswordPageLogo } from './password/PasswordPageLogo';
import { PasswordPageBackground } from './password/PasswordPageBackground';

interface SitePasswordProps {
  setIsPasswordCorrect: (isCorrect: boolean) => void;
}

export const SitePassword: React.FC<SitePasswordProps> = ({ setIsPasswordCorrect }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zap-yellow relative overflow-hidden">
      <PasswordPageBackground />
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <PasswordPageLogo />
        
        <p className="mb-6 text-center text-gray-600">
          This site is password protected. Please enter the password to continue.
        </p>
        
        <PasswordForm setIsPasswordCorrect={setIsPasswordCorrect} />
        
        <PasswordDisclaimer />
      </div>
    </div>
  );
};

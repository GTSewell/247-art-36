
import React from 'react';

export const PasswordDisclaimer: React.FC = () => {
  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <p className="text-center text-[#ea384c] font-bold italic">
        Note: This site is purely in prototype mode solely for reference purposes only.
      </p>
      
      {/* Blue instruction box moved from SitePassword component */}
      <div className="mt-4 p-3 border-2 border-zap-blue rounded-md bg-zap-blue/10">
        <p className="text-center font-bold text-black">
          If you need a password, please fill out the form below
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-center text-gray-700 font-medium">
          After entering the password, you'll be automatically logged in to our artist demo account
        </p>
      </div>
    </div>
  );
};

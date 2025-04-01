
import React from "react";

export const PasswordGateDisclaimer: React.FC = () => {
  return (
    <>
      {/* Site info in white box with red text */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4 text-[#ea384c]">
          <h3 className="font-bold text-center mb-6">READ ME</h3>
          <p className="font-bold">
            This site is currently under development.
          </p>
          <p className="font-bold">
            We are seeking input from professional artists, designers, & businesses within the local arts industry to get the best possible outcome for us all.
          </p>
          <p className="font-bold">
            Please consider anything and everything you see and read as confidential and purely placeholder information as we beta test, and refine our offering.
          </p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <div className="text-center">
          <h3 className="font-bold text-gray-800 mb-2">Demo Account</h3>
          <p className="text-sm text-gray-600">After entering the site password, you'll be automatically logged in as:</p>
          <p className="text-sm text-gray-600 font-semibold mt-2">Email: demo247artist@gmail.com</p>
          <p className="text-sm text-gray-600 font-semibold">Password: 12341234</p>
        </div>
      </div>
    </>
  );
};

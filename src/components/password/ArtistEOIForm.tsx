
import React from 'react';

export const ArtistEOIForm: React.FC = () => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-center font-bold text-lg text-gray-800 mb-4">Don't have a password?</h3>
      <p className="text-center text-gray-600 mb-4">
        If you're an artist interested in 247.art, please fill out this form to express your interest.
      </p>
      
      {/* Tally embedded form */}
      <div className="mt-4">
        <iframe 
          src="https://tally.so/embed/3xzD9E?hideTitle=1&transparentBackground=1&dynamicHeight=1" 
          width="100%" 
          height="500" 
          frameBorder="0" 
          marginHeight={0} 
          marginWidth={0} 
          title="Artist Expression of Interest"
          className="rounded-lg w-full"
        />
      </div>
    </div>
  );
};


import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

export const ArtistEOIForm: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-4 md:mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md border-2 border-zap-blue">
      <h3 className="text-center font-bold text-base md:text-lg text-gray-800 mb-3 md:mb-4">Don't have a password?</h3>
      <p className="text-center text-sm md:text-base text-gray-600 mb-3 md:mb-4">
        If you're an artist interested in learning more about 247.art, please fill out this form.
      </p>
      
      {/* Tally embedded form with zap blue styling and proper mobile responsiveness */}
      <div className="mt-3 md:mt-4 border-2 border-zap-blue rounded-lg p-2 bg-zap-blue/10">
        <iframe 
          src="https://tally.so/embed/3xzD9E?hideTitle=1&transparentBackground=1&dynamicHeight=1" 
          width="100%" 
          height={isMobile ? "400" : "300"} 
          frameBorder="0" 
          marginHeight={0} 
          marginWidth={0} 
          title="Artist Expression of Interest"
          className="rounded-lg w-full"
          style={{
            maxWidth: "100%",
            overflow: "hidden"
          }}
        />
      </div>
    </div>
  );
};

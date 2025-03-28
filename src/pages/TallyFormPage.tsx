
import React, { useEffect } from 'react';

const TallyFormPage = () => {
  useEffect(() => {
    // Load Tally embed script
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Apply styles to make the iframe full screen
  return (
    <div className="h-screen w-full overflow-hidden">
      <iframe 
        data-tally-src="https://tally.so/r/mRjY59" 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        marginHeight="0" 
        marginWidth="0" 
        title="247 Artist Profile Set-up."
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, border: 0 }}
      ></iframe>
    </div>
  );
};

export default TallyFormPage;

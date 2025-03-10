
import React from 'react';

interface ArtistBioProps {
  bio: string;
  isMobile: boolean;
  useAccordion?: boolean;
}

const ArtistBio: React.FC<ArtistBioProps> = ({ bio, isMobile, useAccordion = false }) => {
  if (!bio) {
    return null;
  }

  // Create a bio preview for mobile view
  const bioPreview = bio.length > 120 
    ? `${bio.substring(0, 120)}...` 
    : bio;

  // If not using accordion, just return the bio text directly
  if (!useAccordion) {
    return (
      <div className="mb-4 w-full min-w-0">
        <h3 className="font-bold text-base mb-2">Bio</h3>
        <div className="text-gray-700 leading-relaxed w-full overflow-hidden text-wrap break-words max-w-full min-w-0">
          {bio}
        </div>
      </div>
    );
  }

  // Otherwise use the accordion (for space-constrained views)
  return (
    <div className="w-full mb-4 min-w-0">
      <div className="border-b pb-1 mb-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-base">{isMobile ? "Bio" : bioPreview}</span>
        </div>
      </div>
      <div className="text-gray-700 leading-relaxed w-full overflow-hidden text-wrap break-words max-w-full min-w-0">
        {bio}
      </div>
    </div>
  );
};

export default ArtistBio;

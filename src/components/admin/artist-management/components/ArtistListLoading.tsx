
import React from 'react';

const ArtistListLoading: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
      <p>Loading artists...</p>
    </div>
  );
};

export default ArtistListLoading;

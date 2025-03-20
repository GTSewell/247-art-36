
import React from 'react';

interface AllArtistsHeaderProps {
  artistsCount: number;
}

const AllArtistsHeader: React.FC<AllArtistsHeaderProps> = ({
  artistsCount,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-foreground">All Artists</h2>
    </div>
  );
};

export default AllArtistsHeader;

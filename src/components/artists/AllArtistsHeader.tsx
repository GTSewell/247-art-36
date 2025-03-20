
import React from 'react';

interface AllArtistsHeaderProps {
  artistsCount: number;
}

const AllArtistsHeader: React.FC<AllArtistsHeaderProps> = ({
  artistsCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 mb-6">
      <h2 className="text-3xl font-bold text-foreground text-center sm:text-left">All Artists</h2>
    </div>
  );
};

export default AllArtistsHeader;


import React from 'react';
import { Artist } from '@/data/types/artist';
import { Avatar } from "@/components/ui/avatar";

interface ArtistMobileHeaderProps {
  artist: Artist;
}

const ArtistMobileHeader: React.FC<ArtistMobileHeaderProps> = ({ artist }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Avatar className="h-16 w-16 rounded-md border">
        {artist.image ? (
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="object-cover h-full w-full"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
            {artist.name?.substring(0, 2).toUpperCase() || "NA"}
          </div>
        )}
      </Avatar>
      <div>
        <h2 className="font-bold text-lg">{artist.name}</h2>
        <p className="text-sm text-gray-600">{artist.specialty}</p>
        {(artist.city || artist.country) && (
          <p className="text-xs text-gray-500">
            {[artist.city, artist.country].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ArtistMobileHeader;

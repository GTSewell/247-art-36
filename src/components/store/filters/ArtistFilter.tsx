import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArtistFilterProps {
  selectedArtist: string;
  artists: string[];
  onArtistChange: (value: string) => void;
}

export const ArtistFilter: React.FC<ArtistFilterProps> = ({
  selectedArtist,
  artists,
  onArtistChange
}) => {
  if (artists.length === 0) return null;

  return (
    <Select 
      value={selectedArtist} 
      onValueChange={(value) => onArtistChange(value === 'all' ? '' : value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Artists" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Artists</SelectItem>
        {artists.map(artist => (
          <SelectItem key={artist} value={artist}>{artist}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
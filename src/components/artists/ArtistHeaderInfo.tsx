
import React from 'react';
import { Palette, MapPin, AtSign } from 'lucide-react';

interface ArtistHeaderInfoProps {
  name: string;
  specialty: string;
  city: string;
  country: string;
}

const ArtistHeaderInfo: React.FC<ArtistHeaderInfoProps> = ({
  name,
  specialty,
  city,
  country
}) => {
  // Create a formatted domain name based on artist name
  const artistDomain = name ? `${name.replace(/\s+/g, '').replace(/[^\w\s]/gi, '')}.247.art` : '';
  
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-muted-foreground flex items-center gap-1.5">
        <Palette size={16} className="text-gray-500" /> 
        {specialty}
      </p>
      <p className="text-muted-foreground text-sm flex items-center gap-1.5">
        <MapPin size={16} className="text-gray-500" /> 
        {city}, {country}
      </p>
      {artistDomain && (
        <p className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1.5">
          <AtSign size={16} className="text-blue-600" />
          {artistDomain}
        </p>
      )}
    </div>
  );
};

export default ArtistHeaderInfo;

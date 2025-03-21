
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
    <div className="mb-2">
      <h2 className="text-3xl font-bold mb-3">{name}</h2>
      <p className="text-muted-foreground flex items-center gap-2 text-lg mb-2">
        <Palette size={20} className="text-gray-500" /> 
        {specialty}
      </p>
      <p className="text-muted-foreground text-lg flex items-center gap-2 mb-2">
        <MapPin size={20} className="text-gray-500" /> 
        {city}, {country}
      </p>
      {artistDomain && (
        <p className="text-lg flex items-center gap-2 text-gray-700">
          <AtSign size={20} className="text-gray-500" />
          {artistDomain}
        </p>
      )}
    </div>
  );
};

export default ArtistHeaderInfo;

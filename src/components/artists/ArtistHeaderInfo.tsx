
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
    <div className="mb-6">
      <h2 className="text-3xl font-bold mb-2">{name}</h2>
      <p className="text-muted-foreground flex items-center gap-1.5 text-base mb-1.5">
        <Palette size={18} className="text-gray-500" /> 
        {specialty}
      </p>
      <p className="text-muted-foreground text-base flex items-center gap-1.5 mb-1.5">
        <MapPin size={18} className="text-gray-500" /> 
        {city}, {country}
      </p>
      {artistDomain && (
        <p className="text-base flex items-center gap-1.5 text-gray-700">
          <AtSign size={18} className="text-gray-500" />
          {artistDomain}
        </p>
      )}
    </div>
  );
};

export default ArtistHeaderInfo;

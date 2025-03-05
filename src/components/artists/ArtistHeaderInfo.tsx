
import React from 'react';
import { MapPin, Palette } from 'lucide-react';

interface ArtistHeaderInfoProps {
  name: string;
  specialty: string;
  city?: string;
  country?: string;
}

const ArtistHeaderInfo: React.FC<ArtistHeaderInfoProps> = ({ 
  name, 
  specialty, 
  city, 
  country 
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">{name}</h2>
      <div className="flex items-center gap-2 text-gray-600 mb-1">
        <Palette size={18} />
        <span>{specialty}</span>
      </div>
      {(city || country) && (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={18} />
          <span>{[city, country].filter(Boolean).join(", ")}</span>
        </div>
      )}
    </div>
  );
};

export default ArtistHeaderInfo;

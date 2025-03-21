
import React from 'react';

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
      <p className="text-muted-foreground">{specialty}</p>
      <p className="text-muted-foreground text-sm">{city}, {country}</p>
      {artistDomain && (
        <p className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
          {artistDomain}
        </p>
      )}
    </div>
  );
};

export default ArtistHeaderInfo;

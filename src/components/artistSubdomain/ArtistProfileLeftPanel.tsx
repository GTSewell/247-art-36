
import React from 'react';
import { Artist } from '@/data/types/artist';

interface ArtistProfileLeftPanelProps {
  artist: Artist;
  techniques: string[];
  styles: string[];
  panelColor: string;
}

const ArtistProfileLeftPanel: React.FC<ArtistProfileLeftPanelProps> = ({
  artist,
  techniques,
  styles,
  panelColor
}) => {
  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      <div className="flex items-start mb-4">
        <div className="mr-4">
          <div className="w-16 h-16 rounded-md overflow-hidden">
            <img 
              src={artist.image || '/placeholder.svg'} 
              alt={artist.name || 'Artist'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold">{artist.name}</h2>
          <p className="text-sm text-gray-600">{artist.specialty}</p>
          <p className="text-xs text-gray-500">
            {artist.city}{artist.city && artist.country ? ', ' : ''}{artist.country}
          </p>
        </div>
      </div>

      <div className="flex-grow">
        {/* Bio Section - Expanded by default */}
        <div className="mb-6">
          <h3 className="text-left font-bold text-base mb-3">Bio</h3>
          <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
        </div>

        {/* Techniques & Styles Section - Expanded by default */}
        {(techniques.length > 0 || styles.length > 0) && (
          <div>
            <h3 className="text-left font-bold text-base mb-3">
              Techniques & Styles
            </h3>
            
            {techniques.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-1">Techniques</h4>
                <div className="flex flex-wrap gap-1">
                  {techniques.map((technique, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {styles.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Styles</h4>
                <div className="flex flex-wrap gap-1">
                  {styles.map((style, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistProfileLeftPanel;

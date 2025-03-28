import React from 'react';
import { Artist } from '@/data/types/artist';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArtistProfileLeftPanelProps {
  artist: Artist;
  techniques: string[];
  styles: string[];
  panelColor: string;
  badgeBgColor?: string;
}

const ArtistProfileLeftPanel: React.FC<ArtistProfileLeftPanelProps> = ({
  artist,
  techniques,
  styles,
  panelColor,
  badgeBgColor = '#f5f5f5'
}) => {
  const formatBioText = (text: string) => {
    const paragraphs = text.split(/\n+/).filter(p => p.trim() !== '');
    
    if (paragraphs.length <= 1) {
      return <p>{text}</p>;
    }
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} className={index > 0 ? "mt-4" : ""}>
        {paragraph}
      </p>
    ));
  };

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

      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          <div className="mb-6">
            <h3 className="text-left font-bold text-base mb-3">Bio</h3>
            <div className="text-gray-700 leading-relaxed">
              {formatBioText(artist.bio || '')}
            </div>
          </div>
          
          <div className="flex-grow min-h-[200px]"></div>
          
          {(techniques.length > 0 || styles.length > 0) && (
            <div className="w-full mt-auto mb-2">
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
                        className="inline-block px-2 py-1 text-gray-700 text-xs rounded-md"
                        style={{ backgroundColor: badgeBgColor }}
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
                        className="inline-block px-2 py-1 text-gray-700 text-xs rounded-md"
                        style={{ backgroundColor: badgeBgColor }}
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ArtistProfileLeftPanel;


import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ArtistTechniquesStylesProps {
  techniques: string[];
  styles: string[];
  badgeBgColor?: string;
  useAccordion?: boolean;
}

const ArtistTechniquesStyles: React.FC<ArtistTechniquesStylesProps> = ({ 
  techniques, 
  styles,
  badgeBgColor,
  useAccordion = false
}) => {
  if ((!techniques || techniques.length === 0) && (!styles || styles.length === 0)) {
    return null;
  }

  const defaultBadgeBg = 'bg-gray-100';
  const badgeStyle = badgeBgColor ? { backgroundColor: badgeBgColor } : {};

  // Always expanded content now
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-base mb-3">Techniques & Styles</h3>
      
      {techniques && techniques.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-1">Techniques</h4>
          <div className="flex flex-wrap gap-2">
            {techniques.map((technique: string, index: number) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={badgeBgColor ? '' : defaultBadgeBg}
                style={badgeStyle}
              >
                {technique}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {styles && styles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-1">Styles</h4>
          <div className="flex flex-wrap gap-2">
            {styles.map((style: string, index: number) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={badgeBgColor ? '' : defaultBadgeBg}
                style={badgeStyle}
              >
                {style}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistTechniquesStyles;

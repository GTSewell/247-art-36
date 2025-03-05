
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface ArtistTechniquesStylesProps {
  techniques: string[];
  styles: string[];
  badgeBgColor?: string;
}

const ArtistTechniquesStyles: React.FC<ArtistTechniquesStylesProps> = ({ 
  techniques, 
  styles,
  badgeBgColor
}) => {
  if ((!techniques || techniques.length === 0) && (!styles || styles.length === 0)) {
    return null;
  }

  const defaultBadgeBg = 'bg-gray-100';
  const badgeStyle = badgeBgColor ? { backgroundColor: badgeBgColor } : {};

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="techniques-styles" className="border-b-0">
        <AccordionTrigger className="py-1 hover:no-underline">
          <span className="text-left font-semibold">Techniques & Styles</span>
        </AccordionTrigger>
        <AccordionContent>
          {techniques && techniques.length > 0 && (
            <div className="mb-2">
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
            <div className="pb-1">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ArtistTechniquesStyles;

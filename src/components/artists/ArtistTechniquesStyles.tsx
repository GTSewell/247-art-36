
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
}

const ArtistTechniquesStyles: React.FC<ArtistTechniquesStylesProps> = ({ techniques, styles }) => {
  if ((!techniques || techniques.length === 0) && (!styles || styles.length === 0)) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="techniques-styles" className="border-b-0">
        <AccordionTrigger className="py-2 hover:no-underline">
          <span className="text-left font-semibold">Techniques & Styles</span>
        </AccordionTrigger>
        <AccordionContent>
          {techniques && techniques.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Techniques</h4>
              <div className="flex flex-wrap gap-2">
                {techniques.map((technique: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
                    {technique}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {styles && styles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Styles</h4>
              <div className="flex flex-wrap gap-2">
                {styles.map((style: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
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

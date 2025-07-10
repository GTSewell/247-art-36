import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface ArtistBioProps {
  bio: string;
  highlightBio?: string;
  isMobile: boolean;
  useAccordion?: boolean;
  useHighlightBio?: boolean;
}

const ArtistBio: React.FC<ArtistBioProps> = ({ 
  bio, 
  highlightBio, 
  isMobile, 
  useAccordion = false, 
  useHighlightBio = false 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determine which bio to use
  const displayBio = useHighlightBio && highlightBio ? highlightBio : bio;
  
  if (!displayBio) {
    return null;
  }

  // Format bio text by converting line breaks to proper React elements
  const formatBioText = (text: string) => {
    // Split the text by newline characters
    const paragraphs = text.split(/\n+/).filter(p => p.trim() !== '');
    
    if (paragraphs.length <= 1) {
      // If there are no explicit line breaks, return the text as is
      return <p>{text}</p>;
    }
    
    // Otherwise, return each paragraph with proper spacing
    return paragraphs.map((paragraph, index) => (
      <p key={index} className={index > 0 ? "mt-4" : ""}>
        {paragraph}
      </p>
    ));
  };

  // Create a bio preview for long bios
  const isBioLong = displayBio.length > 120;
  const bioPreview = isBioLong 
    ? `${displayBio.substring(0, 120)}...` 
    : displayBio;

  // If using accordion and bio is long, render with accordion
  if (useAccordion && isBioLong) {
    return (
      <div className="mb-4 w-full min-w-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="bio" className="border-0">
            <AccordionTrigger className="py-0 hover:no-underline">
              <h3 className="font-bold text-base">Bio</h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-gray-700 leading-relaxed w-full overflow-hidden text-wrap break-words max-w-full min-w-0">
                {formatBioText(displayBio)}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  // Otherwise use the standard view
  return (
    <div className="mb-4 w-full min-w-0">
      <h3 className="font-bold text-base mb-1">Bio</h3>
      <div className="text-gray-700 leading-relaxed w-full overflow-hidden text-wrap break-words max-w-full min-w-0">
        {formatBioText(displayBio)}
      </div>
    </div>
  );
};

export default ArtistBio;

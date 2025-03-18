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
  isMobile: boolean;
  useAccordion?: boolean;
}

const ArtistBio: React.FC<ArtistBioProps> = ({ bio, isMobile, useAccordion = false }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!bio) {
    return null;
  }

  // Create a bio preview for long bios
  const isBioLong = bio.length > 120;
  const bioPreview = isBioLong 
    ? `${bio.substring(0, 120)}...` 
    : bio;

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
                {bio}
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
        {bio}
      </div>
    </div>
  );
};

export default ArtistBio;

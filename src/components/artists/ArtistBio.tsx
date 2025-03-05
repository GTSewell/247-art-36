
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface ArtistBioProps {
  bio: string;
  isMobile: boolean;
}

const ArtistBio: React.FC<ArtistBioProps> = ({ bio, isMobile }) => {
  if (!bio) {
    return null;
  }

  // Create a bio preview for mobile view
  const bioPreview = bio.length > 120 
    ? `${bio.substring(0, 120)}...` 
    : bio;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="bio" className="border-b-0">
        <AccordionTrigger className="py-1 hover:no-underline">
          <span className="text-left font-bold text-base">
            {isMobile ? "Bio" : bioPreview}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed pb-1">{bio}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ArtistBio;

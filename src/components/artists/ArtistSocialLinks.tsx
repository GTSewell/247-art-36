
import React from 'react';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface ArtistSocialLinksProps {
  socialPlatforms: string[];
}

const ArtistSocialLinks: React.FC<ArtistSocialLinksProps> = ({ socialPlatforms }) => {
  const socialIcons = {
    facebook: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    instagram: <Instagram className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  if (!socialPlatforms || socialPlatforms.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="social-media" className="border-b-0">
        <AccordionTrigger className="py-1 hover:no-underline">
          <span className="text-left font-semibold">Social Media</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex gap-3 pb-1">
            {socialPlatforms.map((platform: string) => {
              const platformKey = platform.toLowerCase() as keyof typeof socialIcons;
              return (
                <button
                  key={platform}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {socialIcons[platformKey] || <span>{platform}</span>}
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ArtistSocialLinks;

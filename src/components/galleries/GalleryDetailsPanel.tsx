
import React from 'react';
import { Gallery } from '@/data/types/gallery';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';

interface GalleryDetailsPanelProps {
  gallery: Gallery;
  onSelect: () => void;
  onClose?: () => void;
}

const GalleryDetailsPanel: React.FC<GalleryDetailsPanelProps> = ({
  gallery,
  onSelect,
  onClose,
}) => {
  const isMobile = useIsMobile();
  
  // Create a bio preview for mobile devices
  const bioPreview = gallery.bio && gallery.bio.length > 120 
    ? `${gallery.bio.substring(0, 120)}...` 
    : gallery.bio;

  return (
    <div className="p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{gallery.name}</h2>
            <p className="text-gray-600 mb-2">
              {gallery.city}, {gallery.country}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
        
        {/* Bio section with accordion */}
        {gallery.bio && (
          <Accordion type="single" collapsible className="w-full mb-4">
            <AccordionItem value="bio" className="border-b-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="text-left font-normal">
                  {isMobile ? bioPreview : gallery.bio}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700 leading-relaxed">{gallery.bio}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        <div className="space-y-2 mb-4">
          <p className="text-sm">
            <span className="font-semibold">Specialty:</span> {gallery.specialty}
          </p>
          {gallery.established_year && (
            <p className="text-sm">
              <span className="font-semibold">Established:</span> {gallery.established_year}
            </p>
          )}
          {gallery.size_sqm && (
            <p className="text-sm">
              <span className="font-semibold">Size:</span> {gallery.size_sqm} m²
            </p>
          )}
        </div>
        {gallery.styles && gallery.styles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {gallery.styles.map((style) => (
              <span
                key={style}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {style}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        <Button onClick={onSelect} className="w-full">
          View Gallery Details
        </Button>
      </div>
    </div>
  );
};

export default GalleryDetailsPanel;

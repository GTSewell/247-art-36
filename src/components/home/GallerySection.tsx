import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';

interface GallerySectionProps {
  galleryImages: string[];
  currentGalleryIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  galleryImages,
  currentGalleryIndex,
  onNextImage,
  onPrevImage,
  onTriggerRef,
  onContentRef
}) => {
  return (
    <AccordionItem value="gallery" className="border-none">
      <AccordionTrigger
        ref={onTriggerRef}
        className="hover:no-underline px-0 py-0 homepage-accordion-group group flex-col items-start md:flex-row md:items-center md:justify-between w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto" style={{
            '--homepage-bg-image': 'url(/lovable-uploads/0e792c6e-d4f2-45f3-9de6-f1c897a07f79.png)'
          } as React.CSSProperties}>
            GALLERY
          </h2>
          <p className="text-xl font-light text-gray-600 ml-0 md:ml-8 font-nove mt-2 md:mt-0 text-left md:text-right">
            MELBOURNE TO THE METAVERSE
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl font-sans">
              Immerse yourself in carefully curated exhibitions that blur the lines between physical and digital spaces. Experience art in its purest form through our state-of-the-art gallery environments and virtual showcases.
            </p>
            <Link
              to="/tour"
              className="px-8 py-3 border-2 border-black text-lg font-medium hover:bg-black hover:text-white transition-colors"
            >
              view all
            </Link>
          </div>
        </div>

        {/* Film Strip Auto Scroll */}
        <div className="relative overflow-hidden bg-black rounded-lg p-4" style={{
          height: '200px' // Constrained height to not exceed gallery title height
        }}>
          <div className="flex animate-[scroll-left_20s_linear_infinite] gap-4 h-full">
            {/* Duplicate gallery images for seamless loop */}
            {[...galleryImages, ...galleryImages, ...galleryImages].map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 h-full aspect-[4/3] bg-white rounded-md overflow-hidden shadow-lg border-2 border-white"
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default GallerySection;
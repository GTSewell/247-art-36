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
  return <AccordionItem value="gallery" className="border-none">
      <AccordionTrigger 
        ref={onTriggerRef}
        className="hover:no-underline px-0 py-0 homepage-accordion-group group"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap"
            style={{
              '--homepage-bg-image': 'url(/lovable-uploads/0e792c6e-d4f2-45f3-9de6-f1c897a07f79.png)'
            } as React.CSSProperties}
          >GALLERY</h2>
          <p className="hidden md:block text-xl font-light text-gray-600 ml-8 font-nove">
            Physical and virtual exhibitions
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl font-sans">
              Immerse yourself in carefully curated exhibitions that blur the lines between physical and digital spaces. Experience art in its purest form through our state-of-the-art gallery environments and virtual showcases.
            </p>
            <Link to="/tour" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
              view all
            </Link>
          </div>
        </div>

        {/* Gallery Viewer */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{
        height: '600px'
      }}>
          <AnimatePresence mode="wait">
            <motion.img key={currentGalleryIndex} src={galleryImages[currentGalleryIndex]} alt="Gallery artwork" initial={{
            opacity: 0,
            x: 300
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -300
          }} transition={{
            duration: 0.3
          }} className="w-full h-full object-cover" />
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button onClick={onPrevImage} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
              prev
            </button>
            <button onClick={onNextImage} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
              next
            </button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>;
};
export default GallerySection;
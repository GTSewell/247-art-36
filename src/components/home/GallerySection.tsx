import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';

interface GallerySectionProps {
  galleryImages: string[];
  currentGalleryIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  galleryImages,
  currentGalleryIndex,
  onNextImage,
  onPrevImage
}) => {
  return (
    <AccordionItem value="gallery" className="border-none">
      <AccordionTrigger className="hover:no-underline px-0 py-8">
        <h2 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black tracking-tighter leading-none">GALLERY</h2>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl">
              Physical and virtual exhibitions, plus professional printing
            </p>
            <Link to="/tour" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
              view all
            </Link>
          </div>
        </div>

        {/* Gallery Viewer */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentGalleryIndex}
              src={galleryImages[currentGalleryIndex]}
              alt="Gallery artwork"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button
              onClick={onPrevImage}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              prev
            </button>
            <button
              onClick={onNextImage}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              next
            </button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default GallerySection;

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useIsMobile();

  const handleImageClick = (index: number) => {
    if (selectedImage === index) {
      setSelectedImage(null);
    } else {
      setSelectedImage(index);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {selectedImage !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 bg-background/90 hover:bg-muted border border-border p-3 rounded-full z-[10001] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="h-6 w-6 text-foreground" />
            </button>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage]}
                alt={`Enlarged variation ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Single image display with navigation */}
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group">
        <img
          src={images[currentImageIndex]}
          alt={`Product image ${currentImageIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {/* Dedicated Zoom Button - Always Visible, Top Left Corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleImageClick(currentImageIndex);
          }}
          className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm p-2 rounded-full opacity-80 hover:opacity-100 transition-all duration-200 hover:bg-black/80 z-[11000] border border-white/20"
          aria-label="Zoom image"
        >
          <Maximize2 className="h-4 w-4 text-white" />
        </button>

        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/30 z-[150]"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/30 z-[150]"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>

            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-[150]">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;

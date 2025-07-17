
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllProductImages } from './utils/imageUtils';

interface ProductImageGalleryProps {
  images?: string[];
  product?: any; // For automatic image extraction
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, product }) => {
  // Use provided images or extract from product
  const displayImages = images || (product ? getAllProductImages(product) : []);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomButtonPosition, setZoomButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Reset image index when product or images change
  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedImage(null);
  }, [product, images]);

  // Update zoom button position when modal opens or window resizes
  useEffect(() => {
    const updateZoomButtonPosition = () => {
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        setZoomButtonPosition({
          top: rect.top + 12, // 12px from top (top-3 = 0.75rem = 12px)
          left: rect.left + 12, // 12px from left (left-3 = 0.75rem = 12px)
        });
      }
    };

    // Check if we're in a modal context by looking for dialog elements
    const isInModal = document.querySelector('[role="dialog"]');
    
    if (isInModal) {
      updateZoomButtonPosition();
      window.addEventListener('resize', updateZoomButtonPosition);
      
      // Use MutationObserver to detect when modal opens/closes
      const observer = new MutationObserver(updateZoomButtonPosition);
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => {
        window.removeEventListener('resize', updateZoomButtonPosition);
        observer.disconnect();
      };
    } else {
      setZoomButtonPosition(null);
    }
  }, []);

  // Update position when current image changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        setZoomButtonPosition({
          top: rect.top + 12,
          left: rect.left + 12,
        });
      }
    }, 100); // Small delay to ensure layout has updated

    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  const handleImageClick = (index: number) => {
    if (selectedImage === index) {
      setSelectedImage(null);
    } else {
      setSelectedImage(index);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
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
                src={displayImages[selectedImage]}
                alt={`Enlarged variation ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Single image display with navigation */}
      <div ref={imageContainerRef} className="relative aspect-square rounded-lg overflow-hidden group bg-transparent">
        <img
          src={displayImages[currentImageIndex]}
          alt={`Product image ${currentImageIndex + 1}`}
          className="w-full h-full object-contain bg-transparent"
        />
        

        {/* Navigation arrows - only show if multiple images */}
        {displayImages.length > 1 && (
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
              {displayImages.map((_, index) => (
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

      {/* Portaled Zoom Button - Rendered outside modal hierarchy */}
      {zoomButtonPosition && typeof window !== 'undefined' && createPortal(
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleImageClick(currentImageIndex);
          }}
          className="fixed bg-black/60 backdrop-blur-sm p-2 rounded-full opacity-80 hover:opacity-100 transition-all duration-200 hover:bg-black/80 z-[10000] border border-white/20"
          style={{
            top: `${zoomButtonPosition.top}px`,
            left: `${zoomButtonPosition.left}px`,
          }}
          aria-label="Zoom image"
        >
          <Maximize2 className="h-4 w-4 text-white" />
        </button>,
        document.body
      )}
    </div>
  );
};

export default ProductImageGallery;

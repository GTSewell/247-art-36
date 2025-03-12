
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    if (selectedImage === index) {
      setSelectedImage(null);
    } else {
      setSelectedImage(index);
    }
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
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-3xl max-h-[80vh] w-full"
            >
              <img
                src={images[selectedImage]}
                alt={`Enlarged variation ${selectedImage + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative aspect-square rounded-lg overflow-hidden shadow-sm group"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image}
              alt={`Variation ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Maximize2 className="h-6 w-6 text-white drop-shadow-md" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;

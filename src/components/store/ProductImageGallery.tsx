
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="grid grid-cols-2 gap-2 md:gap-4 aspect-square relative">
      <AnimatePresence>
        {selectedImage !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
            onClick={() => handleImageClick(selectedImage)}
          >
            <div className="relative aspect-square rounded overflow-hidden cursor-pointer">
              <img
                src={images[selectedImage]}
                alt={`Enlarged variation ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        ) : (
          images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-square rounded overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image}
                alt={`Variation ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductImageGallery;

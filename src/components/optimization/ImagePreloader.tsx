import React from 'react';
import { Helmet } from 'react-helmet';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ 
  images, 
  priority = false 
}) => {
  if (!images.length) return null;

  return (
    <Helmet>
      {images.map((imageUrl, index) => (
        <link
          key={imageUrl}
          rel="preload"
          as="image"
          href={imageUrl}
          {...(priority && index < 3 && { fetchpriority: "high" })}
        />
      ))}
    </Helmet>
  );
};

export default ImagePreloader;
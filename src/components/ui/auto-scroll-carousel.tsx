import React from 'react';
import { motion } from 'framer-motion';
import { Artist } from '@/data/types/artist';

interface AutoScrollCarouselProps {
  artists: Artist[];
  speed?: number;
}

const AutoScrollCarousel: React.FC<AutoScrollCarouselProps> = ({ 
  artists, 
  speed = 50 
}) => {
  // Duplicate the artists array to create seamless loop
  const duplicatedArtists = [...artists, ...artists];

  return (
    <div className="overflow-hidden w-full relative">
      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -100 * artists.length]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
        style={{ width: `${200 * duplicatedArtists.length}px` }}
      >
        {duplicatedArtists.map((artist, index) => (
          <div
            key={`${artist.id}-${index}`}
            className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={artist.image || '/placeholder.svg'}
              alt={artist.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
        ))}
      </motion.div>
      
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white/80 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default AutoScrollCarousel;
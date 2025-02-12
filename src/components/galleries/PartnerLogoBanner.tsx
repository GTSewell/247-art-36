
import React from 'react';
import { motion } from 'framer-motion';

// Generate 15 placeholder company logos with different colors
const partnerLogos = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Partner ${i + 1}`,
  // Using a mix of zap colors and complementary colors
  color: [
    '#f7cf1e', // zap yellow
    '#ef3f36', // zap red
    '#00baef', // zap blue
    '#34d399', // emerald
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f97316', // orange
    '#06b6d4', // cyan
    '#14b8a6', // teal
    '#6366f1', // indigo
    '#f43f5e', // rose
    '#0ea5e9', // sky
    '#8b5cf6', // violet
    '#10b981', // emerald
    '#6366f1', // indigo
  ][i],
}));

const PartnerLogoBanner = () => {
  return (
    <div className="w-full h-[50px] bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="relative flex items-center h-full">
        <motion.div
          className="flex gap-8 absolute whitespace-nowrap"
          animate={{
            x: [0, -1920], // Assuming standard width, will loop regardless of screen size
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex items-center justify-center w-[100px] h-[40px]"
            >
              <div
                className="w-full h-full rounded flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: logo.color }}
              >
                {logo.name}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PartnerLogoBanner;

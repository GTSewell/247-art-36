
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Boxes, CircleDot, Box, Diamond, Hexagon, Pentagon, Square, Triangle, Star, Circle, Gem, Crown, Shapes, Zap } from 'lucide-react';

// Generate 15 unique company logos with icons and names
const partnerLogos = [
  { id: 1, name: 'TechCube', icon: Box, color: '#ef3f36' },
  { id: 2, name: 'StarNet', icon: Star, color: '#f7cf1e' },
  { id: 3, name: 'HexaCore', icon: Hexagon, color: '#00baef' },
  { id: 4, name: 'DiamondTech', icon: Diamond, color: '#34d399' },
  { id: 5, name: 'InfinityCo', icon: CircleDot, color: '#8b5cf6' },
  { id: 6, name: 'CrownSys', icon: Crown, color: '#ec4899' },
  { id: 7, name: 'TriTech', icon: Triangle, color: '#f97316' },
  { id: 8, name: 'BoxLogic', icon: Boxes, color: '#06b6d4' },
  { id: 9, name: 'SquareOne', icon: Square, color: '#14b8a6' },
  { id: 10, name: 'PentaCore', icon: Pentagon, color: '#6366f1' },
  { id: 11, name: 'GemSoft', icon: Gem, color: '#f43f5e' },
  { id: 12, name: 'CircleTech', icon: Circle, color: '#0ea5e9' },
  { id: 13, name: 'ShapeWorks', icon: Shapes, color: '#8b5cf6' },
  { id: 14, name: 'ZapTech', icon: Zap, color: '#10b981' },
  { id: 15, name: 'BuildCorp', icon: Building2, color: '#6366f1' },
];

const PartnerLogoBanner = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[50px] backdrop-blur-sm overflow-hidden">
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
          {[...partnerLogos, ...partnerLogos].map((logo, index) => {
            const Icon = logo.icon;
            return (
              <div
                key={`${logo.id}-${index}`}
                className="flex items-center justify-center w-[100px] h-[40px]"
              >
                <div
                  className="w-full h-full rounded flex items-center justify-center gap-2 text-white font-bold px-2"
                  style={{ backgroundColor: logo.color }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs truncate">{logo.name}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default PartnerLogoBanner;

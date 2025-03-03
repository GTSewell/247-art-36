
import React from 'react';
import { MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClickIndicatorProps {
  showClickIndicator: boolean;
  isHovered: boolean;
  isMobile: boolean;
}

export const ClickIndicator: React.FC<ClickIndicatorProps> = ({
  showClickIndicator,
  isHovered,
  isMobile
}) => {
  if (!showClickIndicator || (!isHovered && !isMobile)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className="absolute bottom-4 right-4 flex items-center justify-center bg-[#0EA5E9]/90 p-2 rounded-full z-10 shadow-lg"
      onClick={e => e.stopPropagation()}
    >
      <MousePointerClick className="w-6 h-6 text-white animate-pulse" />
    </motion.div>
  );
};

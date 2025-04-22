import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
interface CarouselNavigationProps {
  showControls: boolean;
  isMobile: boolean;
  onPrevious: () => void;
  onNext: () => void;
}
const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  showControls,
  isMobile,
  onPrevious,
  onNext
}) => {
  if (!showControls && isMobile) return null;
  return <AnimatePresence>
      {(showControls || !isMobile) && <>
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="absolute z-50 left-2 top-1/2 -translate-y-1/2">
            <Button variant="ghost" size="icon" onClick={onPrevious} className="h-8 w-8 rounded-full shadow-md transition-colors bg-zap-blue font-bold text-3xl text-justify">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="absolute z-50 right-2 top-1/2 -translate-y-1/2">
            <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </>}
    </AnimatePresence>;
};
export default CarouselNavigation;
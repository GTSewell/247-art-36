
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{
        opacity: 0
      }} 
      animate={{
        opacity: 1
      }} 
      transition={{
        duration: 0.5,
        delay: 0.2
      }} 
      className="relative w-full mt-0"
    >
      {/* Red Halftone Background Image - Full Width */}
      <div className="w-full">
        <img 
          src="/lovable-uploads/0d1d9757-2d61-4242-9d9c-b28d760acdc1.png" 
          alt="Red Halftone Background" 
          className="w-full h-auto object-cover" 
        />
      </div>
      
      {/* Rocket Icon - Centered absolute positioning */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
        <img 
          src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png" 
          alt="Rocket Icon" 
          className={`w-full ${isMobile ? 'max-w-[200px]' : 'max-w-[400px]'} animate-float z-10`} 
        />
      </div>
    </motion.div>
  );
};

export default BottomSection;


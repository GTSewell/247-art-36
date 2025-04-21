
import { motion } from "framer-motion";

const Hero = () => {
  return <div className="relative min-h-screen bg-background flex flex-col w-full">
      {/* Full-bleed background image at top */}
      <div className="absolute top-0 left-0 w-full h-auto z-0 overflow-visible">
        <img src="/lovable-uploads/c693ca44-0cc1-4657-b8ec-fdeae1a36b19.png" alt="247art-Gallery-Melbourne-EPIC 100-DAY EXHIBITION" className="object-cover w-full h-auto object-top" draggable={false} style={{
        userSelect: "none"
      }} />
      </div>
      {/* Floating 247art Logo (above the image, centered and 100px below header bar) */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-start pt-[150px] min-h-[60vh]">
        <motion.img alt="ZAP!" initial={{
        scale: 0.5,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 0.5
      }} src="/lovable-uploads/0a6bd5ae-33d2-4a16-a140-31f4944a76f8.png" className="h-32 md:h-32 mx-auto animate-float" />
      </div>
      {/* Footer (the "Built by artist" logo) is expected to be rendered elsewhere as before */}
    </div>;
};
export default Hero;


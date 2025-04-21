
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between w-full">
      {/* Background image shifted down slightly so top is not cut off */}
      <div className="absolute left-0 w-full h-[min(65vw,500px)] z-0" style={{ top: 24 }}>
        <img
          src="/lovable-uploads/61844a65-76b3-461e-a68c-9bccec8942c9.png"
          alt="EPIC 100-DAY EXHIBITION"
          className="object-cover w-full h-full"
          draggable={false}
          style={{ userSelect: "none" }}
        />
      </div>
      {/* Floating 247art Logo (above the image, centered) */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center min-h-[60vh]">
        <motion.img
          alt="ZAP!"
          className="h-32 md:h-48 mx-auto animate-float"
          src="/lovable-uploads/10585327-7129-43c2-a90b-0544e7a9a420.png"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {/* Footer (the "Built by artist" logo) is expected to be rendered elsewhere as before */}
    </div>
  );
};

export default Hero;

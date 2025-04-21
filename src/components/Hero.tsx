
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between">
      {/* Responsive, full-bleed background image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/lovable-uploads/61844a65-76b3-461e-a68c-9bccec8942c9.png"
          alt="EPIC 100-DAY EXHIBITION"
          className="w-full h-full object-cover object-top md:object-top object-center select-none"
          draggable={false}
          style={{ userSelect: "none" }}
        />
      </div>
      {/* Content above the image */}
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
      {/* Footer is still expected elsewhere */}
    </div>
  );
};

export default Hero;


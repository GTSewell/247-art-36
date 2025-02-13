
import { motion } from "framer-motion";
import { useState } from "react";

const Hero = () => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Halftone Background Image */}
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/e16074dd-11b0-4f2e-bcc8-06b5fa6c282a.png"
          alt="Halftone Pattern"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <img
              src="/lovable-uploads/59a6f684-31db-4ac2-a157-a94968384f00.png"
              alt="ZAP!"
              className="h-32 md:h-48 mx-auto animate-float"
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-bold"
          >
            <p className="mb-2">You create. We create. Together we hustle!</p>
            <p>It's time for an revolution in the art world, and we're not going to be able to do it on our own. And neither will you!</p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => setIsClicked(!isClicked)}
              className={`${isClicked ? 'bg-zap-blue' : 'bg-[#ea384c]'} text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105`}
            >
              {isClicked ? 'Coming soon' : 'Get the app'}
            </button>
            <button className="border-2 border-[#ea384c] text-[#ea384c] px-8 py-3 rounded-full font-bold hover:bg-[#ea384c] hover:text-white transition-all duration-200">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

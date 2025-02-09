
import { motion } from "framer-motion";

const Hero = () => {
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
              src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png"
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
            <p className="mb-2">The next-generation payment platform</p>
            <p>for artists, galleries, and creative services.</p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-zap-blue text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105">
              Get Started
            </button>
            <button className="border-2 border-zap-blue text-zap-blue px-8 py-3 rounded-full font-bold hover:bg-zap-blue hover:text-white transition-all duration-200">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

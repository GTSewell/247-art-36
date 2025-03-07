
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <div className="py-20 px-4 relative overflow-visible min-h-[600px] bg-zap-yellow">
      {/* Halftone Background */}
      <img 
        src="/lovable-uploads/5d0599b7-4561-43b3-af8b-550a349ed4fc.png"
        alt="Halftone Pattern"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto text-center relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-zap-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors mb-16"
        >
          Get Started with <img src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png" alt="ZAP!" className="inline-block h-8" />
        </motion.button>

        {/* Powered By Section */}
        <div className="mt-16 relative z-10">
          <p className="text-black mb-6 text-lg font-extrabold">Powered by:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <motion.a
              href="https://www.247.art"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/lovable-uploads/43f5719e-a69d-483e-aeda-bc85b9c5deba.png"
                alt="247 Art"
                className="h-12"
              />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToAction;


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
        {/* Powered By Section */}
        <div className="mt-16 relative z-10">
          <p className="text-black mb-6 text-lg font-extrabold">Powered by:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-black font-extrabold text-3xl"
            >
              ARTISTS
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToAction;

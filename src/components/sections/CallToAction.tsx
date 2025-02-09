
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
        <h1 className="text-5xl font-bold text-white mb-6">Join the <img src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png" alt="ZAP!" className="inline-block h-16" /> Revolution</h1>
        <p className="text-2xl mb-8 max-w-2xl mx-auto">
          Tired of chasing payments? Want to <span className="font-bold">get paid instantly</span> and <span className="font-bold">focus on your creativity</span>? <img src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png" alt="ZAP!" className="inline-block h-8" /> is built <span className="font-bold">for creators, by creators</span> to make financial transactions <span className="font-bold">fast, fair, and fun.</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-zap-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors mb-16"
        >
          Get Started with <img src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png" alt="ZAP!" className="inline-block h-8" />
        </motion.button>

        {/* Powered By Section */}
        <div className="mt-16 relative z-10">
          <p className="text-gray-600 mb-6 text-lg font-bold">Powered by:</p>
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
            <motion.a
              href="https://www.stables.money"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/lovable-uploads/c1aa52df-209a-44c5-9706-d2209db8a011.png"
                alt="Stables"
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

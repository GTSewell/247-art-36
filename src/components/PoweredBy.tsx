
import { motion } from "framer-motion";

const PoweredBy = () => {
  return (
    <div className="py-16 text-center">
      <p className="text-gray-600 mb-6 text-lg">Powered by:</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <motion.a
          href="https://www.247.art"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#D3E4FD] rounded-full px-6 py-3 transition-colors hover:bg-[#C2D3EC]"
        >
          <img
            src="/lovable-uploads/43f5719e-a69d-483e-aeda-bc85b9c5deba.png"
            alt="247 Art"
            className="h-8"
          />
        </motion.a>
        <motion.a
          href="https://www.stables.money"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#F2FCE2] rounded-full px-6 py-3 transition-colors hover:bg-[#E1EBD1]"
        >
          <img
            src="/lovable-uploads/c1aa52df-209a-44c5-9706-d2209db8a011.png"
            alt="Stables"
            className="h-8"
          />
        </motion.a>
      </div>
    </div>
  );
};

export default PoweredBy;

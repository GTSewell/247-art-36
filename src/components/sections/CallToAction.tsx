
import { motion } from "framer-motion";

const CallToAction = () => {
  return <div className="py-20 px-4 relative overflow-visible min-h-[600px] bg-zap-yellow">
      {/* Halftone Background */}
      <img src="/lovable-uploads/5d0599b7-4561-43b3-af8b-550a349ed4fc.png" alt="Halftone Pattern" className="absolute inset-0 w-full h-full object-cover" />
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="container mx-auto text-center relative z-10">
        {/* Built By Artists For Artists section - image removed */}
        <div className="mt-16 relative z-10 flex justify-center">
          {/* Image removed as requested */}
        </div>
      </motion.div>
    </div>;
};

export default CallToAction;

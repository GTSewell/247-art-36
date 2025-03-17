
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VirtualTourSection = () => {
  return (
    <section 
      id="virtual-tour" 
      className="px-4 bg-gradient-to-b from-zap-blue to-zap-yellow relative z-10 my-0 py-[80px] text-center"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Our Space</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Take a virtual tour of our innovative art space and see where the magic happens.
        </p>
        <Link to="/virtual-tour">
          <Button size="lg" className="bg-[#ea384c] hover:bg-[#c62c3d] text-white font-bold">
            Take the Virtual Tour
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default VirtualTourSection;

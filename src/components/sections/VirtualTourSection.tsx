import { motion } from "framer-motion";
import MatterportViewer from "@/components/MatterportViewer";
const VirtualTourSection = () => {
  return <section id="virtual-tour" className="px-4 bg-gradient-to-b from-zap-blue to-transparent relative z-10 my-0 py-[40px]">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="container mx-auto">
        <div className="aspect-video w-full">
          <MatterportViewer modelId="BNNRoZpfMt6" height="100%" />
        </div>
      </motion.div>
    </section>;
};
export default VirtualTourSection;
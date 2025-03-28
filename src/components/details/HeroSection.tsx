
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.5
      }} 
      className="max-w-3xl mx-auto text-center mb-16 bg-zap-yellow p-6 rounded-lg shadow-md border-2 border-black"
    >
      <h1 className="text-4xl font-bold mb-6 text-black">Signature Artist Exhibition</h1>
      <p className="text-lg text-black mb-4">
        Whether you're just starting your journey in the art world, or, you're a seasoned pro. Our Signature Artist package is flexible enough to cater to all. 
      </p>
      <p className="text-lg text-black">
        Below you will find full details on the Signature Artist package, along with both an Artwork Size & Exhibition Profit Calculator to help you better understand your investment value.
      </p>
      <p className="text-lg text-black">
        Our goal is to give artists &amp; collectors an amazing gallery experience, and at very least a good return on your investment through art sales.
      </p>
      <p className="text-lg text-black">
        We do understand that is not always going to be easy, but we're here to work together and give you the best damn chance at succeeding.
      </p>
      <p className="text-lg text-black font-bold">
        Please read through the dropdown info in the features table below. Select a row to expand the info.
      </p>
    </motion.div>
  );
};

export default HeroSection;


import { motion } from "framer-motion";
import PricingFeature from "./PricingFeature";

interface PricingPackageProps {
  title: string;
  price: string;
  priceColor: string;
  iconColor: string;
  imageSrc: string;
  features: Array<{
    text: string;
    percentage?: string;
    isIncluded?: boolean;
  }>;
  animationDirection: "left" | "right";
}

const PricingPackage = ({
  title,
  price,
  priceColor,
  iconColor,
  imageSrc,
  features,
  animationDirection
}: PricingPackageProps) => {
  return (
    <motion.div 
      initial={{
        opacity: 0,
        x: animationDirection === "left" ? -20 : 20
      }} 
      animate={{
        opacity: 1,
        x: 0
      }} 
      transition={{
        duration: 0.5
      }} 
      className="space-y-6"
    >
      <img 
        src={imageSrc} 
        alt={title} 
        className="w-full max-w-[300px] mx-auto" 
      />
      
      <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">
          {title}
        </h2>
        <ul className="space-y-3 text-gray-800">
          {features.map((feature, index) => (
            <PricingFeature 
              key={index} 
              text={feature.text} 
              percentage={feature.percentage} 
              color={iconColor} 
              isIncluded={feature.isIncluded} 
            />
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default PricingPackage;

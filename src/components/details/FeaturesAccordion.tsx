
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Feature } from "./data/featuresData";
import { useRef } from "react";

interface FeaturesAccordionProps {
  features: Feature[];
}

const FeaturesAccordion = ({ features }: FeaturesAccordionProps) => {
  const visibleFeatures = features.filter(feature => !feature.hidden);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    <div className="py-8">
      <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
        {visibleFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            ref={el => itemRefs.current[`item-${index}`] = el}
          >
            <AccordionItem
              value={`item-${index}`}
              className="border-none rounded-lg overflow-hidden group"
            >
              <AccordionTrigger
                className="px-4 py-3 text-black hover:no-underline group bg-[#33C3F0] hover:bg-zap-red data-[state=open]:bg-zap-red"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-normal">{feature.name}</span>
                  </div>
                  <div className="text-right text-lg font-normal">
                    {feature.name === "💥 Signature Artist" ? (
                      <div className="flex items-center space-x-2">
                        <span className="line-through text-gray-500">$1495 AUD</span>
                        <span>{feature.signatureArtist}</span>
                      </div>
                    ) : (
                      feature.signatureArtist
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 bg-zap-yellow text-black text-lg border border-black rounded-b-lg">
                {feature.description && (
                  <div dangerouslySetInnerHTML={{ __html: feature.description }} />
                )}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <a 
          href="https://print.oshi.id/products/feature-247-art-exhibition" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full"
        >
          <img
            src="/lovable-uploads/f3a7cf43-9d36-4c14-9815-181b95ad0b23.png"
            alt="Secure Your Spot Here"
            className="w-full max-w-[500px] mx-auto hover:scale-105 transition-transform duration-300"
          />
        </a>
      </motion.div>
    </div>
  );
};

export default FeaturesAccordion;

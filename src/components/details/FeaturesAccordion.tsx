
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Feature } from "./data/featuresData";
import { useRef, useState } from "react";

interface FeaturesAccordionProps {
  features: Feature[];
}

const FeaturesAccordion = ({ features }: FeaturesAccordionProps) => {
  // Filter out hidden features
  const visibleFeatures = features.filter(feature => !feature.hidden);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [scrollPositionLocked, setScrollPositionLocked] = useState(false);

  // Handler for preventing scroll position changes when clicking accordion
  const handleItemClick = (e: React.MouseEvent) => {
    // Store current scroll position
    const currentScrollPos = window.scrollY;
    
    // Set flag to indicate we're handling an accordion click
    setScrollPositionLocked(true);
    
    // After a short delay to allow the accordion to toggle
    setTimeout(() => {
      // Restore scroll position
      window.scrollTo({
        top: currentScrollPos,
        behavior: "auto" // Use "auto" to prevent smooth scrolling animation
      });
      
      // Reset the flag
      setScrollPositionLocked(false);
    }, 50);
    
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="py-8">
      <Accordion type="single" collapsible className="space-y-4">
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
              className="border-black border-2 rounded-lg overflow-hidden"
              onClick={handleItemClick}
            >
              <AccordionTrigger
                className="px-4 py-3 bg-zap-blue text-white hover:bg-zap-red hover:no-underline group data-[state=open]:bg-zap-red"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-zap-yellow flex-shrink-0" />
                  <span className="text-lg font-medium">{feature.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 bg-zap-yellow text-black text-lg">
                <div className="space-y-4">
                  {feature.description && (
                    <div 
                      className="mb-4" 
                      dangerouslySetInnerHTML={{ __html: feature.description }} 
                    />
                  )}
                  {feature.signatureArtist && (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                        <span className="font-bold">Signature Artist</span>
                        <span>
                          {feature.signatureArtist === true 
                            ? "✓" 
                            : feature.signatureArtist}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
};

export default FeaturesAccordion;

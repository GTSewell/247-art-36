
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Feature } from "./data/featuresData";

interface FeaturesAccordionProps {
  features: Feature[];
}

const FeaturesAccordion = ({ features }: FeaturesAccordionProps) => {
  // Filter out hidden features
  const visibleFeatures = features.filter(feature => !feature.hidden);

  return (
    <div className="py-8">
      <Accordion type="single" collapsible className="space-y-4">
        {visibleFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AccordionItem
              value={`item-${index}`}
              className="border-black border-2 rounded-lg overflow-hidden"
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
                    <div dangerouslySetInnerHTML={{ __html: feature.description }} />
                  )}
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {feature.signatureArtist && (
                        <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                          <span className="font-bold">Signature Artist</span>
                          <span>{feature.signatureArtist === true ? "✓" : feature.signatureArtist}</span>
                        </div>
                      )}
                      {feature.studioArtist && (
                        <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                          <span className="font-bold">Studio Artist</span>
                          <span>{feature.studioArtist === true ? "✓" : feature.studioArtist}</span>
                        </div>
                      )}
                      {feature.featureArtist && (
                        <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                          <span className="font-bold">Feature Artist</span>
                          <span>{feature.featureArtist === true ? "✓" : feature.featureArtist}</span>
                        </div>
                      )}
                    </div>
                  </div>
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


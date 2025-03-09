
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info } from "lucide-react";

interface ProductInfoAccordionProps {
  description: string;
  openAccordions: string[];
  onAccordionChange: (value: string) => void;
}

const ProductInfoAccordion: React.FC<ProductInfoAccordionProps> = ({
  description,
  openAccordions,
  onAccordionChange
}) => {
  return (
    <Accordion 
      type="multiple" 
      value={openAccordions} 
      onValueChange={(value) => {
        // When the accordion state changes, we need to update our parent component
        if (value.length > openAccordions.length) {
          // Something was opened - find what's new
          const newItem = value.find(item => !openAccordions.includes(item));
          if (newItem) onAccordionChange(newItem);
        } else {
          // Something was closed - find what's missing
          const closedItem = openAccordions.find(item => !value.includes(item));
          if (closedItem) onAccordionChange(closedItem);
        }
      }}
      className="w-full"
    >
      <AccordionItem value="details" className="border-b-0 md:border-b">
        <AccordionTrigger className="text-base md:text-lg font-semibold py-2 md:py-3">
          Details
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-sm md:text-base text-muted-foreground">
            {description || "Discover this exclusive limited edition print, meticulously crafted to capture the essence of contemporary artistry. Each piece is individually numbered and personally signed by the artist, making it a unique addition to any collection."}
          </p>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="specifications" className="border-b-0 md:border-b">
        <AccordionTrigger className="text-base md:text-lg font-semibold py-2 md:py-3">
          Specifications
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
            <li>• Signed and numbered by the artist</li>
            <li>• 310gsm 100% cotton-rag</li>
            <li>• 200yr archival inks</li>
            <li>• Embossed</li>
            <li>• NFC chipped</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="production-shipping" className="border-b-0 md:border-b">
        <AccordionTrigger className="text-base md:text-lg font-semibold py-2 md:py-3">
          Production & Shipping
        </AccordionTrigger>
        <AccordionContent>
          <div className="bg-yellow-50 p-2 md:p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs md:text-sm text-yellow-800">
                  Final edition count is determined on the conclusion of the countdown.
                </p>
                <p className="text-xs md:text-sm text-yellow-700">
                  As we need to run production and organize artist/s to sign. Expect arrival of your artwork up to 8 weeks. 
                  (Though, we'll do our best to make that happen waaay quicker!)
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductInfoAccordion;

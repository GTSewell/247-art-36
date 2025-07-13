
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info, Box, Truck } from "lucide-react";

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
        <AccordionTrigger className="text-base font-medium py-2 px-1 hover:no-underline">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-2 text-gray-500" />
            <span>Details</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-1">
          <p className="text-sm text-muted-foreground">
            {description || "Discover this exclusive limited edition print, meticulously crafted to capture the essence of contemporary artistry. Each piece is individually numbered and personally signed by the artist, making it a unique addition to any collection."}
          </p>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="specifications" className="border-b-0 md:border-b">
        <AccordionTrigger className="text-base font-medium py-2 px-1 hover:no-underline">
          <div className="flex items-center">
            <Box className="h-4 w-4 mr-2 text-gray-500" />
            <span>Specifications</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-1">
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
              Signed and numbered by the artist
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
              310gsm 100% cotton-rag
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
              200yr archival inks
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
              Embossed
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
              NFC chipped
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="production-shipping" className="border-b-0 md:border-b">
        <AccordionTrigger className="text-base font-medium py-2 px-1 hover:no-underline">
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-2 text-gray-500" />
            <span>Production & Shipping</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-1">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>We offer standard and express shipping options, as well as international delivery. Local pickup is also available in Melbourne.</p>
            
            <p>Shipping costs and delivery times will be calculated at checkout based on your location and selected shipping method.</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductInfoAccordion;

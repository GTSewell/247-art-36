
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VideoPlayer from "@/components/VideoPlayer";

interface FaqItem {
  title: string;
  content: React.ReactNode;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const accordionRef = useRef<HTMLDivElement>(null);
  
  // Use Intersection Observer to detect when accordion is visible
  useEffect(() => {
    if (!accordionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // When the accordion becomes visible in the viewport
          if (entry.isIntersecting) {
            // Auto-open the first accordion item (the 5P's one)
            setOpenItem('item-0');
            // Disconnect the observer after opening to avoid reopening
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the element is visible
    );
    
    observer.observe(accordionRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div className="py-8" ref={accordionRef}>
      <Accordion 
        type="single" 
        collapsible 
        className="space-y-4"
        value={openItem}
        onValueChange={setOpenItem}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AccordionItem value={`item-${index}`} className="border-white/20 rounded-lg overflow-hidden">
              <AccordionTrigger 
                className="px-4 py-3 bg-zap-blue text-white hover:bg-zap-red hover:no-underline group data-[state=open]:bg-zap-red"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-zap-yellow flex-shrink-0" />
                  <span className="text-lg font-medium">{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 bg-white/5 text-black text-lg">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqAccordion;

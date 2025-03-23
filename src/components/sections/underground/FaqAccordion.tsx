import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!accordionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setOpenItem('item-0');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    
    observer.observe(accordionRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (!openItem || !isMobile) return;
    
    const itemRef = itemRefs.current[openItem];
    if (itemRef) {
      setTimeout(() => {
        const yOffset = -80;
        const y = itemRef.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [openItem, isMobile]);
  
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
            ref={el => itemRefs.current[`item-${index}`] = el}
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
                  <span className="text-lg font-medium">{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 bg-zap-yellow text-black text-lg">
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

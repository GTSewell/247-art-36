
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
  return (
    <div className="py-8">
      <Accordion type="single" collapsible className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AccordionItem value={`item-${index}`} className="border-white/20 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-white/10 text-white hover:bg-white/20 hover:no-underline group">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-zap-yellow group-hover:text-zap-red transition-colors duration-200 flex-shrink-0" />
                  <span className="text-lg font-medium">{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 bg-white/5 text-white text-lg">
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

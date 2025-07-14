import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
interface PrintSectionProps {
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const PrintSection: React.FC<PrintSectionProps> = ({ onTriggerRef, onContentRef }) => {
  return <AccordionItem value="print" className="border-none">
      <AccordionTrigger 
        ref={onTriggerRef}
        className="hover:no-underline px-0 my-0 font-extrabold text-9xl py-0 homepage-accordion-group group flex-col items-start md:flex-row md:items-center md:justify-between w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto"
            style={{
              '--homepage-bg-image': 'url(/lovable-uploads/74dcd042-cc32-4e03-9897-a8f73536b520.png)'
            } as React.CSSProperties}
          >PRINT</h2>
          <p className="text-xl font-light text-gray-600 ml-0 md:ml-8 font-nove mt-2 md:mt-0 text-left md:text-right">
            CUSTOM STICKERS | TEES | PRINTS & MORE
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl font-sans">
              Transform digital masterpieces into tangible works of art with our museum-grade printing technology. From intimate prints to large-scale installations, we ensure every detail preserves the artist's original vision.
            </p>
            <Link to="/details" className="px-8 py-3 border-2 border-foreground text-lg font-medium hover:bg-foreground hover:text-background transition-colors">
              learn more
            </Link>
          </div>
        </div>

        {/* Print Info Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">premium quality</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Museum Grade Papers</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Archival quality papers that last generations
            </p>
          </div>

          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">custom sizes</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Any Dimension</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              From small prints to large format installations
            </p>
          </div>

          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">fast delivery</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Quick Turnaround</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Professional printing with fast, reliable delivery
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>;
};
export default PrintSection;
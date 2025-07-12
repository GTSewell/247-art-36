import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const PrintSection: React.FC = () => {
  return <AccordionItem value="print" className="border-none">
      <AccordionTrigger className="hover:no-underline px-0 my-0 font-extrabold text-9xl py-[28px]">
        <h2 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-agharti font-black tracking-normal leading-none uppercase">PRINT</h2>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl">
              Professional printing services for artists and collectors
            </p>
            <Link to="/details" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
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
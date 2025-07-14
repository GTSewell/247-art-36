import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
interface EventsSectionProps {
  onTriggerRef?: (element: HTMLElement | null) => void;
  onContentRef?: (element: HTMLElement | null) => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ onTriggerRef, onContentRef }) => {
  return <AccordionItem value="events" className="border-none">
      <AccordionTrigger 
        ref={onTriggerRef}
        className="hover:no-underline px-0 py-0 homepage-accordion-group group flex-col items-start md:flex-row md:items-center md:justify-between w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center w-full md:justify-between">
          <h2 
            className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[24rem] xl:text-[32rem] font-agharti font-black leading-none uppercase homepage-accordion-title bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] whitespace-nowrap w-full text-left md:w-auto"
            style={{
              '--homepage-bg-image': 'url(/lovable-uploads/4da04b9f-0458-4482-93e2-bf8eac91b95b.png)'
            } as React.CSSProperties}
          >EVENTS</h2>
           <p className="text-xl font-light text-gray-600 ml-0 md:ml-8 font-nove mt-2 md:mt-0 text-left md:text-right">
             ATTEND OR HOST YOUR NEXT WORKSHOP | POP-UP | EXHIBITION
           </p>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={onContentRef} className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl font-sans">
              Join a vibrant community of creators through exclusive workshops, opening nights, and collaborative sessions. Connect with like-minded artists and art enthusiasts in spaces designed to inspire and educate.
            </p>
            <button 
              className="px-8 py-3 border-2 border-black text-lg font-medium hover:bg-black hover:text-white transition-colors cursor-pointer bg-transparent"
              data-tally-open="nPEkWx"
              data-tally-emoji-text="👋" 
              data-tally-emoji-animation="wave"
            >
              Book Venue
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">workshop</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Digital Art Masterclass</h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4">
              Learn advanced techniques from industry professionals
            </p>
            <button className="text-xs sm:text-sm underline">read more</button>
          </div>

          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">exhibition</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Emerging Voices</h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4">
              Showcasing the next generation of creative talent
            </p>
            <button className="text-xs sm:text-sm underline">read more</button>
          </div>

          <div className="bg-black text-white p-3 sm:p-6 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">community</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Art & Coffee</h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-4">
              Monthly meetups for artists and art lovers
            </p>
            <button className="text-xs sm:text-sm underline">read more</button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>;
};
export default EventsSection;
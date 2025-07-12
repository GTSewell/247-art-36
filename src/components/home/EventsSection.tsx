import React from 'react';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const EventsSection: React.FC = () => {
  return (
    <AccordionItem value="events" className="border-none">
      <AccordionTrigger className="hover:no-underline px-0 py-8">
        <h2 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-memesique font-black tracking-wide leading-none uppercase">EVENTS</h2>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-16">
        <div className="mb-20">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light text-gray-600 max-w-xl">
              Workshops, exhibitions, and community gatherings
            </p>
            <Link to="/store" className="text-xl border-b-2 border-black hover:border-gray-600 transition-colors">
              view all
            </Link>
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
    </AccordionItem>
  );
};

export default EventsSection;
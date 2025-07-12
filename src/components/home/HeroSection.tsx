import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-20 pb-32"
    >
      <div className="w-full pl-4 md:pl-8 lg:pl-12">
        <div className="mb-20">
          <h1 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-agharti font-black tracking-normal leading-none text-left uppercase">
            247.ART
          </h1>
          
          <div className="mt-8 max-w-lg">
            <p className="text-xl font-light mb-8">
              The official home for all creative minds.
            </p>
            <button className="px-8 py-3 border-2 border-black text-lg font-medium hover:bg-black hover:text-white transition-colors">
              Enter Gallery
            </button>
          </div>
        </div>

        {/* Latest Updates Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-20 pr-4 md:pr-8 lg:pr-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black text-white p-3 sm:p-6 rounded-lg"
          >
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">Latest Exhibition</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Underground Collective</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Featuring emerging artists from around the globe...
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black text-white p-3 sm:p-6 rounded-lg"
          >
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">Latest Feature</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Artist Profiles 2.0</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Enhanced artist dashboard with live preview...
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black text-white p-3 sm:p-6 rounded-lg"
          >
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
              <span className="text-xs sm:text-sm italic">Latest Story</span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Art Never Sleeps</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              The story behind 247.ART and our mission...
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
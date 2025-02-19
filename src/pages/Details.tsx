
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

const Details = () => {
  return (
    <main className="min-h-screen bg-[#9ec0d2]">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Intro paragraph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Choose Your Launch Path</h1>
          <p className="text-lg text-gray-800">
            Whether you're ready to take off or just starting your journey, we have the perfect package for you. Select between our Launchpad and Rocket options to begin your artistic ascent.
          </p>
        </motion.div>

        {/* Images and tiers section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Launchpad Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <img 
              src="/lovable-uploads/fbba846a-cd1a-49f7-9772-3d4da9f82b33.png"
              alt="Launchpad"
              className="w-full max-w-[300px] mx-auto"
            />
            <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-black mb-4">Launchpad Package</h2>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Your bullet points will go here
                </li>
                {/* Add more bullet points as needed */}
              </ul>
            </div>
          </motion.div>

          {/* Center Rocket Icon */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center items-center"
          >
            <img 
              src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
              alt="Rocket Icon"
              className="w-full max-w-[400px] animate-float"
            />
          </motion.div>

          {/* Rocket Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <img 
              src="/lovable-uploads/1bf5c788-4ce4-4e1c-a643-dcef88e9b0ff.png"
              alt="Rocket"
              className="w-full max-w-[300px] mx-auto"
            />
            <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-black mb-4">Rocket Package</h2>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Your bullet points will go here
                </li>
                {/* Add more bullet points as needed */}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Details;

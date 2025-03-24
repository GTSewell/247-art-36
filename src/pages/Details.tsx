
import Navigation from "@/components/navigation/Navigation";
import { motion } from "framer-motion";
import ArtistPackageTable from "@/components/details/ArtistPackageTable";
import ArtworkSizeCalculator from "@/components/details/ArtworkSizeCalculator";
import SalesCalculator from "@/components/details/SalesCalculator";
import InterestForm from "@/components/sections/underground/InterestForm";
import { outroText } from "@/components/sections/underground/faqData";
import { useIsMobile } from "@/hooks/use-mobile";
import DetailsFaqAccordion from "@/components/details/DetailsFaqAccordion";
import { detailsFaqItems } from "@/components/details/detailsFaqData";

const Details = () => {
  const isMobile = useIsMobile();

  return <main className="min-h-screen bg-[#f7cf1e] overflow-hidden relative">
      {/* Top Red Halftone Background - Full Width */}
      <div className="absolute top-0 left-0 right-0 w-full z-10">
        <img src="/lovable-uploads/41f4bd11-64e7-4a89-bc4f-730883fb8f4e.png" alt="Red Halftone Background Top" className="w-full h-auto object-cover" />
      </div>
      
      {/* Navigation sits above the halftone background */}
      <div className="relative z-20">
        <Navigation />
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-0 relative z-10">
        {/* Intro paragraph - Added black border */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="max-w-3xl mx-auto text-center mb-16 bg-zap-yellow p-6 rounded-lg shadow-md border-2 border-black">
          <h1 className="text-4xl font-bold mb-6 text-black">Signature Artist Exhibition</h1>
          <p className="text-lg text-black mb-4">
            Whether you're just starting your journey in the art world, or, you're a seasoned pro. Our Signature Artist package is flexible enough to cater to all. 
          </p>
          <p className="text-lg text-black">
            Below you will find full details on the Signature Artist package, along with both an Artwork Size & Exhibition Profit Calculator to help you better understand your investment value.
          </p>
          <p className="text-lg text-black">Our goal is to give artists &amp; collectors an amazing gallery experience, and at very least a good return on your investment through art sales. 

We do understand that is not always going to be easy, but we're here to work together and give you the best damn chance at succeeding.</p>
        </motion.div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <ArtistPackageTable />
        </div>
        
        {/* Sales Calculator - Moved above Artwork Size Calculator */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.3
      }} className="max-w-4xl mx-auto mt-16">
          <SalesCalculator />
        </motion.div>
        
        {/* Artwork Size Calculator - Now below Sales Calculator */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.4
      }} className="max-w-4xl mx-auto mt-16">
          <ArtworkSizeCalculator />
        </motion.div>
        
        {/* FAQ Accordion - Added inside the selected container */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.5
      }} className="flex justify-center items-center my-12 flex-col">
          <h2 className="text-3xl font-bold text-black mb-6">Frequently Asked Questions</h2>
          <div className="w-full max-w-4xl">
            <DetailsFaqAccordion items={detailsFaqItems} />
          </div>
        </motion.div>

        {/* "LFG, I Want In!" Image with animation and link - MOVED BELOW SALES CALCULATOR */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.6
      }} className="flex justify-center items-center my-12">
          <a href="https://print.oshi.id/products/feature-247-art-exhibition" target="_blank" rel="noopener noreferrer">
            <img src="/lovable-uploads/125e0b0f-15c8-4d5a-a182-4a1dc5d0594c.png" alt="LFG, I Want In!" className="w-full max-w-[500px] animate-float cursor-pointer" />
          </a>
        </motion.div>

        {/* Interest Form */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.7
      }} className="max-w-4xl mx-auto mt-16 mb-0 my-0 py-0">
          
          <InterestForm introText={outroText} />
        </motion.div>
      </div>

      {/* Full-width Red Halftone Background with Rocket - Outside the container */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5,
      delay: 0.2
    }} className="relative w-full mt-0">
        {/* Red Halftone Background Image - Full Width */}
        <div className="w-full">
          <img src="/lovable-uploads/2d2a11b1-3157-4f38-82be-6b60ce75150d.png" alt="Red Halftone Background" className="w-full h-auto object-cover" />
        </div>
        
        {/* Rocket Icon - Centered absolute positioning */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
          <img 
            src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png" 
            alt="Rocket Icon" 
            className={`w-full ${isMobile ? 'max-w-[200px]' : 'max-w-[400px]'} animate-float z-10`} 
          />
        </div>
      </motion.div>
    </main>;
};
export default Details;

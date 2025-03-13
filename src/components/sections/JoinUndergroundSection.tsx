
import { motion } from "framer-motion";
import { Zap, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import VideoPlayer from "@/components/VideoPlayer";
import { supabase } from "@/integrations/supabase/client";
import PricingPackage from "../details/PricingPackage";

const JoinUndergroundSection = () => {
  const intro = "Right now, this page is locked to the public—only artists with this invite can see it.\n\nWe're building a new way to exhibit, sell, and grow, and we want the right people on board before we open this up. No fees yet, no commitment—just a chance to be part of something big from day one.";
  
  // Updated video URL using the signed URL from Supabase product-images bucket
  const videoUrl = "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/sign/product-images/247-Zap-OSHI-lowres.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0LWltYWdlcy8yNDctWmFwLU9TSEktbG93cmVzLm1wNCIsImlhdCI6MTc0MTMyMDc3NSwiZXhwIjoxODI3NzIwNzc1fQ.Ahy09SxUV4GxpZ-tUTuD1_nZGLbVy3XwYywvz-RHJss";
  
  const faqItems = [
    {
      title: "Exhibition Opportunity",
      content: <span key="exhibition"><strong className="font-bold">A MASSIVE 3-MONTH EXHIBITION</strong> in the heart of Melbourne's arts precinct on the world famous <strong className="font-bold">Smith St, Collingwood</strong>. Think of it like an Art Fair, but running for 3 months, not 3 days. Oh, and we'll handle the selling with our very own professional art curator and sales legend, Jane who loves nothing more than learning everything she can about YOU, the artist. We want you to focus on your art and creative ideas. We are here to help fulfil them. How it should be!<br /><br />Also, did you know it was voted 'Coolest Street' in the world by <a href="https://www.timeout.com/melbourne/news/smith-street-has-been-named-the-coolest-street-in-the-world-060921" target="_blank" rel="noopener noreferrer" className="text-zap-yellow hover:underline">Timeout</a> in 2021? Ok. It was a different time then. We believe it's time for us all to shine again, and bring back the vibe we lost after that bat sneezed on a human in 2020!</span>
    },
    {
      title: "Artist-Friendly Commission Structure",
      content: <span key="commission">How does a <strong className="font-bold">25% COMMISSION</strong> sound? Traditional galleries charge artists on average a 50% commission. Well, we're not planning to be a "traditional" gallery at all, things need to be shaken up, and, we're here to do that with you. It's time for something different! Our aim is to put as much as possible back into artists pockets.</span>
    },
    {
      title: "Your Personal Retail Print Shop",
      content: <span key="retail"><strong className="font-bold">Your very own retail print shop</strong> stocked with everything from your own custom stickers, T-shirts & Poster designs as affordable art for new age collectors, to premium line of signed/embossed Limited & Timed Edition Museum grade archival Fine Art Prints (Giclee) to appease your existing collectors. We'll be adding some more cool things for you to add if you like in over time. Even if you've got an idea for something, we'll do our best to make it happen!<br /><br />You receive 75% of all profits on your base retail Stickers, T-shirts, unsigned and open edition prints etc. On your custom signed Limited Editions etc there is a base price, and you get the rest!<br /><br />Artists need to embrace creating affordable art & collectibles, as you are leaving 99.99% of prospective 'art collectors' on the table. The kiddo that buys your $4 sticker today, buys your $1000 painting tomorrow. We do not discount that value, and neither should you.<br /><br />With time you build your 100 true collectors, or even 1000!<br /><br />BTW. We'll take care of all the boring shit that's a hassle, consider us as your personal sales assistant & print bitches for the 3 months. <strong className="font-bold">YOU just focus on your art!</strong></span>
    },
    {
      title: "Digital Profile and Presence",
      content: <span key="profile">Not everyone can make it to our IRL space, and that's why we're taking it to the world with your very own <strong className="font-bold">247.art KICK-ASS digital profile!</strong><br /><br />Each artist will receive their own custom profile, think of it as a 'Link in BIO' domain with direct sales right there in your BIO, and not as bland as what is out there today.<br /><br />We call it the artist <strong className="font-bold">ATLAS</strong>, an acronym for Artist BIO, Techniques/Styles, Links, Artworks & Social media. A searchable artist "encyclopedia" (do they even exist anymore?) all in one place!<br /><br />On top of that, we'll add a fully immersive 3D lidar scan of the exhibition! Peep the <Link to="/virtual-tour" className="text-zap-yellow hover:underline">/virtualtour</Link><br /><br /><div className="flex items-center gap-2 justify-center"><ArrowLeft className="w-5 h-5" /> <strong className="font-bold">[yournamehere].247.art</strong> <ArrowRight className="w-5 h-5" /></div></span>
    },
    {
      title: "Future Technology Integration",
      content: (
        <span key="future">
          <strong className="font-bold">THE FUTURE IS HERE</strong> and we are already ahead of the game, and we don't want you to be left behind!
          
          <div className="my-4 bg-white/10 p-4 rounded-lg">
            <VideoPlayer 
              src={videoUrl} 
              className="mx-auto max-w-full"
              title="Future of Art Technology Showcase"
              poster="/placeholder.svg"
            />
            <div className="text-center mt-2">
              <a 
                href="https://www.instagram.com/p/DG4QxbBSjtz/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zap-yellow hover:underline inline-flex items-center gap-1"
              >
                View on Instagram
              </a>
            </div>
          </div>
          
          <br />Aside from some artists having gripes with AI LLM's (Large Language Models) training off artworks all across the internets, this is not what we're about. We understand it, but, we also know it's not going to wait for us either. We need to build and harness the technology for the best parts.<br /><br />The simple fact is, you are the best LLM already, Human Intelligence, or, "HI".<br /><br />We're all about AI helping you make the "other things in life" easier, more efficient. If you already use AI for your art practice, we're all supportive!<br /><br /><div className="text-center">/// Insert Blockchain here ///</div><br /><br />Seriously. DON'T RUN! We know some of you create NFTs and some of you hate them. We're fine with that. BUT. We are not interested in pushing new mediums on anyone, far from it. We also do not care for the speculative crypto gambling on meme coins and 'pump & dumps', in most cases it's a zero-sum game. We don't like that part.<br /><br />What we do like, is the technology that underpins it all, the blockchain. It can, and will, change the way we simplify things like transactions and provenance in the art world.<br /><br />We have 8yrs experience in this area, leading Australia in the blockchain art sector. What we are working on will not only change the local art scene, but, the global art economy. Big call, we know. It's coming.<br /><br />Anyway, we are and will be at the forefront, finding the best AI, blockchain and new technology solutions to help artists with the day-to-day grind with the likes of social media and administration.
        </span>
      )
    }
  ];

  // Pricing packages data from Details page
  const launchpadFeatures = [
    { text: "100 Days Exhibition (3 months+)" },
    { text: "Gallery Commission on Original Artwork", percentage: "25%" },
    { text: "Artist Commission of RRP on Retail Sales", percentage: "30%" },
    { text: "1 sqm Artwork Space" },
    { text: "1 Artwork Change Per Month" },
    { text: "1 Artwork per sqm" },
    { text: "Video Wall Profile (1 rotation every 3)" },
    { text: "24hr Timed Edition Drops Available" },
    { text: "Black or White T-shirt Options" },
    { text: "Custom 247 Artist Profile [yournamehere].247.art", isBoldUrl: true },
    { text: "No Priority Art Hanging", isIncluded: false },
  ];

  const rocketFeatures = [
    { text: "100 Days Exhibition (3 months+)" },
    { text: "Gallery Commission on Original Artwork", percentage: "0%" },
    { text: "Artist Commission of RRP on Retail Sales", percentage: "40%" },
    { text: "1 sqm Artwork Space" },
    { text: "Priority Art Hanging" },
    { text: "Unlimited Artwork Changes (within reason)" },
    { text: "Up to 4 Artworks per sqm" },
    { text: "Video Wall Profile (2 rotations every 3)" },
    { text: "Sculpture Display (40cm x 40cm plinth)" },
    { text: "24hr Timed Edition Drops Available" },
    { text: "Custom 247 Artist Profile [yournamehere].247.art", isBoldUrl: true },
    { text: "Retail 'STP' Merch Pack (Choose any artist)" },
    { text: "247 Artist ATLAS Book + 3 Card Packs" },
    { text: "Shop-front Feature Display" },
    { text: "Custom Embosser for Prints" },
    { text: "Specialty Sticker Options (Metallics, Holographic)" },
    { text: "Full Color Range T-shirt Options" },
  ];

  const outro2 = "Right now, we're in invite-only mode—meaning you get a sneak peek before anyone else. Nothing's locked in yet, we just wanna know if you're down. No payment needed—just drop your EOI for priority curation before we open this up to the world.";

  return (
    <section className="py-24 px-4 bg-zap-blue relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-white">
            This is not just a gallery, a print shop, or a retail space ... THIS IS A MOVEMENT!
          </h1>

          <p className="text-xl text-white/90 whitespace-pre-wrap">{intro}</p>

          <div className="py-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${index}`} className="border-white/20 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 bg-white/10 text-white hover:bg-white/20 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-zap-yellow flex-shrink-0" />
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

          {/* New Pricing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 mb-12"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Ok. So what's the cost?
            </h2>
            
            {/* Images and tiers section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <PricingPackage
                title="Studio Artist"
                price="$995"
                priceColor="zap-blue"
                iconColor="zap-yellow"
                imageSrc="/lovable-uploads/eba2b57e-00f5-43ed-96ec-f1e0e9e1a071.png"
                features={launchpadFeatures}
                animationDirection="left"
              />

              {/* Center Rocket Icon */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:flex justify-center items-center"
              >
                <img 
                  src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
                  alt="Rocket Icon"
                  className="w-full max-w-[260px] animate-float"
                />
              </motion.div>

              <PricingPackage
                title="Feature Artist"
                price="$1,495"
                priceColor="zap-red"
                iconColor="zap-blue"
                imageSrc="/lovable-uploads/5300d0e3-167f-4c3c-aee4-2d1fdd611486.png"
                features={rocketFeatures}
                animationDirection="right"
              />
            </div>
            
            {/* Mobile Rocket Icon */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:hidden flex justify-center items-center mt-8 mb-8"
            >
              <img 
                src="/lovable-uploads/8045e416-b0d7-482c-b222-33fee5d700fc.png"
                alt="Rocket Icon"
                className="w-full max-w-[220px] animate-float"
              />
            </motion.div>

            {/* Link to Details page */}
            <div className="text-center mt-8">
              <Link 
                to="/details" 
                className="text-zap-yellow hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <span>View more details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <div className="bg-white/10 p-6 rounded-lg">
            <p className="text-lg text-white/90 whitespace-pre-wrap">{outro2}</p>
            
            {/* Embedded Tally form */}
            <div className="mt-6">
              <iframe
                src="https://tally.so/embed/3X8q5Y?hideTitle=1&transparentBackground=1&dynamicHeight=1"
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Expression of Interest"
                style={{ minHeight: "500px" }}
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default JoinUndergroundSection;

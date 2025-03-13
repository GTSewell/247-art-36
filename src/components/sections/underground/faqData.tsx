
import { Link } from "react-router-dom";
import VideoPlayer from "@/components/VideoPlayer";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Video URL from Supabase
const videoUrl = "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/sign/product-images/247-Zap-OSHI-lowres.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0LWltYWdlcy8yNDctWmFwLU9TSEktbG93cmVzLm1wNCIsImlhdCI6MTc0MTMyMDc3NSwiZXhwIjoxODI3NzIwNzc1fQ.Ahy09SxUV4GxpZ-tUTuD1_nZGLbVy3XwYywvz-RHJss";

export const faqItems = [
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

// Section text content
export const introText = "Right now, this page is locked to the public—only artists with this invite can see it.\n\nWe're building a new way to exhibit, sell, and grow, and we want the right people on board before we open this up. No fees yet, no commitment—just a chance to be part of something big from day one.";

export const outroText = "Right now, we're in invite-only mode—meaning you get a sneak peek before anyone else. Nothing's locked in yet, we just wanna know if you're down. No payment needed—just drop your EOI for priority curation before we open this up to the world.";

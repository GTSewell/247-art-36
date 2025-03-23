import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <div className="relative">
      {/* Background image with 0.2 opacity */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/c4d9bfb5-2e72-440a-b468-9e82012ec737.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20" 
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 pt-8 relative z-10"
      >
        <h1 className="text-center mb-8 text-gray-50 text-7xl my-[25px] font-extrabold">
          Who the f#@k are we?
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-4 text-lg">
          <p className="text-black text-xl font-bold">
            We are Jane Rolls & GT Sewell, we are artists, we are creatives, but let's be real, we're better at supporting other artists than being artists ourselves. Facts!
          </p>
          <p className="text-black text-xl font-bold">
            We've been long-time advocates for Melbourne & Australia's vibrant arts community. You may have met us galivanting around artist studios, like{' '}
            <a href="https://www.instagram.com/everfreshstudio/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
              Everfresh
            </a>
            {', '}
            <a href="https://www.instagram.com/theartshole/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
              The Artshole
            </a>
            {' '}or{' '}
            <a href="https://www.instagram.com/blenderstudios/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
              Blender
            </a>
            , or even at a kick-ass exhibition at the likes of{' '}
            <a href="https://www.instagram.com/backwoods.gallery/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
              Backwoods
            </a>
            {' '}or{' '}
            <a href="https://www.instagram.com/bside.gallery/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
              B-side
            </a>
            , or maybe you're along the lines of "Who TF are you!?" ... well,
          </p>
          <p className="text-black text-xl font-bold">
            Over the past decade, we've proudly dedicated ourselves to supporting artists and their creative journeys through our work at galleries and studios we've built such as Lanes End, VS. Gallery (with the inimitable Ben Frost & Nixi Killick), Milkbar, and most recently, OSHI our current location, and, future home of 247, on the always vibing Smith St, Collingwood.
          </p>
          <p className="text-black text-xl font-bold">
            Each of these spaces has been a labor of love, designed to foster connections between artists, collectors, and the wider community.
          </p>
          <p className="text-black text-xl font-bold">
            In addition to our gallery work, our artist printing services have been a cornerstone of our efforts to empower artists. By providing high-quality printing in fine art (Giclée), apparel, merchandise, and more, we've helped countless artists generate passive income and expand their creative practices into new avenues.
          </p>
          <p className="text-black text-xl font-bold">
            We've also helped build amazing creative activations around Australia, including{' '}
            <a href="https://www.instagram.com/sandrewmelbs/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
              Sandrew's
            </a>
            {' '}epic street art exhibition{' '}
            <a href="https://www.instagram.com/theoutsidersmelbourne/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
              'The Outsiders Melbourne'
            </a>
            {' '}(A MUST SEE!), to Shepard Fairey's (OBEY){' '}
            <a href="https://lifewithoutandy.com/featured/party-bullshit/obey-printed-matters-shepard-fairey-ambush-pop-up-gallery-sydney/" target="_blank" rel="noopener noreferrer" className="text-black bg-zap-yellow/50 px-1 rounded hover:underline">
              Printed Matters
            </a>
            {' '}Gallery in Sydney.
          </p>
          <p className="text-black text-xl font-bold mx-0">
            With the relaunch of our new space, we're excited to continue our mission in fresh and innovative ways merging, Art, Technology & Culture whilst adhering to our life motto, 'CultureB4Capital'. We're serious about art and we're serious about having fun along the way.
            Let's make cool shit happen! 💙
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutSection;

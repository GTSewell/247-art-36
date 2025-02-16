
import { motion } from "framer-motion";
import { Zap, Users, Palette, Gift, Coins, Trophy, PointRightIcon, PointLeftIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const JoinUndergroundSection = () => {
  const [heading, setHeading] = useState("Join the Underground Before It Blows Up.");
  const [intro, setIntro] = useState("Right now, this page is locked to the public—only artists with this invite can see it.\n\nWe're building a new way to exhibit, sell, and grow, and we want the right people on board before we open this up. No fees yet, no commitment—just a chance to be part of something big from day one.");
  
  const [benefits] = useState([
    <span key="exhibition"><strong className="font-bold">A MASSIVE 3-MONTH EXHIBITION</strong> in the heart of Melbourne's arts precinct on the world famous <strong className="font-bold">Smith St, Collingwood</strong>. You know it was voted 'Coolest Street' in the world by <a href="https://www.timeout.com/melbourne/news/smith-street-has-been-named-the-coolest-street-in-the-world-060921" target="_blank" rel="noopener noreferrer" className="text-zap-yellow hover:underline">Timeout</a> in 2021? Ok. It was a different time then. We believe it's time for us all to shine again, and bring back the vibe we lost after that bat sneezed on a human in 2020!</span>,
    <span key="commission">How does a <strong className="font-bold">10% COMMISSION</strong> not 50% sound? Our aim is to put as much as possible back into your pockets. Artists need to make money now, and not when you're dead!</span>,
    <span key="retail"><strong className="font-bold">Your very own retail print shop</strong> stocked with everything from your own custom stickers, T-shirts & Posters designs as affordable art for new collectors, to Limited & Timed Edition Museum grade archival Fine Art Prints (Giclee). We'll take care of all the boring shit that's a hassle, consider us as you're print bitches for the 3 months. <strong className="font-bold">YOU just focus on your art!</strong></span>,
    <span key="profile">Not everyone can make it to our IRL space, and that's why we're taking it to the world with your very own <strong className="font-bold">247.art KICK-ASS digital profile!</strong> Each artist will receive their own custom profile, think of it as a 'Link in BIO' domain, just not as bland as what is out there today.<br /><br />You can add/remove links to other sites, your socials and your available art collection.<br /><br /><div className="flex items-center gap-2 justify-center"><PointLeftIcon className="w-5 h-5" /> <strong className="font-bold">[yournamehere].247.art</strong> <PointRightIcon className="w-5 h-5" /></div></span>,
    "Workshops, events, and a creative community that actually moves the needle."
  ]);

  const [outro1, setOutro1] = useState("One voice is good. A chorus is louder.\nThis isn't about one artist, one show, one sale—it's about a movement. The more artists on board, the bigger the energy, the louder the noise, the stronger the impact.");
  
  const [outro2, setOutro2] = useState("Right now, we're in invite-only mode—meaning you get a sneak peek before anyone else. Nothing's locked in yet, we just wanna know if you're down. No payment needed—just drop your EOI for priority curation before we open this up to the world.");

  return (
    <section className="py-24 px-4 bg-zap-blue relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="space-y-8">
          {/* Heading */}
          <Textarea
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full text-4xl font-bold text-white bg-transparent border-none resize-none focus:ring-0 hover:bg-white/5 transition-colors overflow-hidden"
            style={{ minHeight: '60px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />

          {/* Intro */}
          <Textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            className="w-full text-xl text-white/90 bg-transparent border-none resize-none focus:ring-0 hover:bg-white/5 transition-colors overflow-hidden whitespace-pre-wrap"
            style={{ minHeight: '200px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />

          {/* Benefits */}
          <div className="space-y-4 py-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <Zap className="w-6 h-6 text-zap-yellow flex-shrink-0 mt-1" />
                <div className="text-white text-lg">
                  {benefit}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Outro 1 */}
          <div className="pt-8">
            <Textarea
              value={outro1}
              onChange={(e) => setOutro1(e.target.value)}
              className="w-full text-xl font-semibold text-white/90 bg-transparent border-none resize-none focus:ring-0 hover:bg-white/5 transition-colors overflow-hidden whitespace-pre-wrap"
              style={{ minHeight: '100px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>

          {/* Outro 2 */}
          <div className="bg-white/10 p-6 rounded-lg">
            <Textarea
              value={outro2}
              onChange={(e) => setOutro2(e.target.value)}
              className="w-full text-lg text-white/90 bg-transparent border-none resize-none focus:ring-0 hover:bg-white/5 transition-colors overflow-hidden whitespace-pre-wrap"
              style={{ minHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default JoinUndergroundSection;

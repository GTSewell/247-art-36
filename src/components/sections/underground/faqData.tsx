
import VideoPlayer from "@/components/VideoPlayer";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Video URL from Supabase
const videoUrl = "https://iqmskopbhrzqqqjewdzv.supabase.co/storage/v1/object/sign/product-images/247-Zap-OSHI-lowres.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0LWltYWdlcy8yNDctWmFwLU9TSEktbG93cmVzLm1wNCIsImlhdCI6MTc0MTMyMDc3NSwiZXhwIjoxODI3NzIwNzc1fQ.Ahy09SxUV4GxpZ-tUTuD1_nZGLbVy3XwYywvz-RHJss";

export const faqItems = [
  {
    title: "The 5P's : 'We Print | Pack | Post | Pay | and of course, solve Problems",
    content: <span key="The 5P's"><strong className="font-bold">WE TAKE CARE OF IT ALL, SO YOU DON'T HAVE TO!</strong> This is all pretty simple for us, as we've spent over a decade helping 1000's of artists around Australia, and the world with all of the above. We understand that dealing with a full-time or part-time job, as well as trying create new artworks (or even just catch up with fam), and then you spend half the day running around to sort out some fresh print/art sales, all to rock up at a post office that just closed. Add salt ... then you miss the 86 tram home and shit just gets wild from here on. Let us deal with it (Not the Tram, that's on you), otherwise, we got you. </span>
  },
  {
    title: "100 Days. 100 Artists!",
    content: <span key="exhibition"><strong className="font-bold">A MASSIVE 3-MONTH EXHIBITION</strong> in the heart of Melbourne's arts precinct on the world famous <strong className="font-bold">Smith St, Collingwood</strong>. Think of it like an Art Fair, but running for 3 months, not 3 days. Oh, and we'll handle sales and the 5P's with our professional team and legendary art curator & gallerist, Jane who loves nothing more than learning everything she can about YOU, the artist. We want you to focus on your art and creative ideas. We are here to help fulfil them. How it should be!<br /><br />Also, did you know it was voted 'Coolest Street' in the world by <span className="text-zap-red">Timeout</span> in 2021? Ok. It was a different time then. We believe it's time for us all to shine again, and bring back, actually, create the new vibe we lost after that bat sneezed on a human in 2020!</span>
  },
  {
    title: "A New Commission Structure. From 25% to 0%",
    content: <span key="commission">How does a <strong className="font-bold">25% COMMISSION</strong> sound, or, 10%, maybe even 0%? Everyone has the opportunity to hit 0% gallery commission. Peep STP Collector packs on the Details page. We know most traditional galleries charge artists on average, 50% commission. Well, we're not planning to be a "traditional" gallery at all, and we're here to shake things up, and we're here to do that with you. It's time for something different!</span>
  },
  {
    title: "Your Personal Retail Quality Print Shop",
    content: <span key="retail"><strong className="font-bold">Your very own retail print shop</strong> stocked with everything from your own custom stickers, T-shirts & Poster designs as affordable art for the new gen red chip artist collectors, to premium line of signed/embossed Limited & Timed Edition Museum grade archival Fine Art Prints (Giclee) to appease your existing collectors. We'll be adding some more cool things for you to add if you like. Even if you've got an idea for something, hit us up! we'll do our best to make it happen.<br /><br />You receive 100%% of all profits on your base retail Stickers, T-shirts, unsigned and open edition prints etc. On your custom signed Limited Editions etc there is a base price, and you take home the rest.<br /><br />Artists need to embrace creating affordable art & collectibles, as you are leaving 99.99% of prospective 'art collectors' on the table. Affordable art has outshone the upper end of the art market, collectors, or should we say 'supportors, are not the same anymore. Times have changed, and we all need to adapt the best we can to it. Remember, the kiddo that buys your $4 sticker today, buys your $1000 painting tomorrow. We do not discount that value, and neither should you.<br /><br />With time you build your 100 true collectors, or even 1000.<br /><br />BTW. We'll take care of all the boring shit that's a hassle, the 5P's Printing | Packaging | Posting | Payments | and of course ... PROBLEMS! Consider us as your personal mentors (if you need support), sales assistants & print bitches for the 3 months. <strong className="font-bold">YOU just focus on your art!</strong></span>
  },
  {
    title: "Digital Sales and Artist Profile. Yours, Forever.",
    content: <span key="profile">Not everyone can make it to our IRL space, and that's why we're taking it to the world with your very own <strong className="font-bold">247.art KICK-ASS online sales profile!</strong><br /><br />Each artist will receive their own custom domain, think of it as a 'Link in BIO' but with direct sales right at your collectors fingertips, and not just a bland few hyperlinks floating on the page.<br /><br />We call it the artist <strong className="font-bold">ATLAS</strong>, an acronym for Artist BIO, Techniques/Styles, Links, Artworks & Social media. A searchable artist "encyclopedia" (do they even exist anymore?) all in one place!<br /><br />On top of that, we'll add a fully immersive 3D lidar scan of the exhibition! Peep the <span className="text-zap-red">/virtualtour</span><br /><br /><div className="flex items-center gap-2 justify-center"><ArrowLeft className="w-5 h-5" /> <strong className="font-bold">[yournamehere].247.art</strong> <ArrowRight className="w-5 h-5" /></div></span>
  },
  {
    title: "The 'STP' Difference",
    content: (
      <span key="future">
        <strong className="font-bold">STP = Stickers | T-Shirt | Print.</strong> This is our unique offering which we produce premium quality in-house an STP Collector pack for each artist. From custom packaging with your artwork on it, to Signed & numbered fine art prints. All packaged and ready to collect. Each STP Collector pack will retail for $124.95 AUD. Making it an affordable entry point for new collectors. The artist has a choice of edition sizes to suit, or you can make it a signed open edition if you like?.
        
        <br /> <strong className="font-bold">THE BONUS COMMISSION INCENTIVE.</strong> For every 1x STP Collector pack you sell you will receive ~$50 and in addition to that, we take 1% off your gallery commission. If you sell 10x STP Collector packs on day 1, your gallery commission will go from 25% to 15% for on your next original artwork sale. If you sell 15 more STP Collector packs in the 1st month, your commission is now 0% on any original artworks sold after that. We know that is not going to be easy for some artists, and we're here to help. Let's be real here, it's a win/win for all of us! <br></br>
      </span>
    )
  }
];

// Section text content
export const introText = "Right now, this page is locked to the public—only artists with this invite can see it.\n\nWe're building a new way to exhibit, sell, and grow, and we want the right people on board before we open this up to the general public. We think it'd be even better if artists curate the exhibition, and not just us.";

export const outroText = "Right now, this page is locked to the public—only artists with an invite can see it. You have been pre-approved for curation. \n\nThis is a new way to exhibit, sell, and grow, and we want the right people on board before we open this up to the general public. \n\nIf you have a friend you think that might also like to be a part of this, we trust your curation. Just let us know and we'll send you a fresh password invite for them too.";

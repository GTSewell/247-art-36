
interface Feature {
  name: string;
  studioArtist: boolean | string;
  featureArtist: boolean | string;
  signatureArtist?: boolean | string;
  description?: string;
  hasDiscount?: boolean;
}

export const features: Feature[] = [
  { 
    name: "Genesis Price", 
    studioArtist: "$995", 
    featureArtist: "$1495", 
    signatureArtist: "$1295",
    description: "One-time payment to join our 247 artist community. This includes all of your retail print & merch production stocked in our space ready for sales, gallery sales staffing, customer management etc. We will take care of everything for you, including the 5 P's, Printing | Packing | Posting | Payments | and of course solving any Problems for you. You focus on creating art, we will take care of the rest.",
    hasDiscount: true
  },
  { 
    name: "Limited Spaces", 
    studioArtist: "50 Artists", 
    featureArtist: "50 Artists", 
    signatureArtist: "100 Artists", 
    description: "Limited spaces ensure we can offer personalized attention for all artists for duration of the exhibition."
  },
  { 
    name: "Exhibition Duration", 
    studioArtist: "~100 Days\n(3 months)", 
    featureArtist: "~100 Days\n(3 months)", 
    signatureArtist: "~100 Days\n(3 months)",
    description: "We believe standard exhibition lengths are too short for maximum impact. You don't see the NGV launch 1 week pop-ups, why? Because the cultural and financial impact in most cases is not worth it. Your work will be displayed in our gallery for approximately 100 days, providing maximum exposure to collectors and art enthusiasts."
  },
  { 
    name: "Gallery Commission (Original Artwork)", 
    studioArtist: "25% to 0%", 
    featureArtist: "10% to 0%", 
    signatureArtist: "25%\nto\n 0%",
    description: "Gallery commission on sales of original artworks. Artists can lower their gallery commission to 0% by selling STP Collector packs (See STP below). Lower percentages mean more profit for you as an artist."
  },
  { 
    name: "STP Collector Pack Sales = 0% commission", 
    studioArtist: "25", 
    featureArtist: "10", 
    signatureArtist: "25",
    description: "For every STP Collector pack you sell, 1% is deducted from your gallery commission. Example: If you sell 15x STP Collector packs, your commission becomes 10% (25 - 15 (STP) = 10) from that point onwards. So if you sell 25x STP Collector packs on day 1, your effective gallery commission will be 0% for the next 3 months.<br /><br /> What is an STP Collector pack? Simple, 'Stickers | T-shirt | Print' with your own individual artist designed packaging. To start, We produce 25x A4 fine art prints for each artist to sign & edition. Your minimum STP Collector pack edition size is '25/25'.<br /><br />You can choose to make the editions larger if you are a high selling artist, Edition 50, 100, 250 etc, or even make it a signed open edition. It is completely up to you. If you are not sure, we will help guide you.<br /><br /> Each STP pack will retail at $124.95, and your commission is ~$50 each pack sold. Consider STP packs a gateway for the new gen collectors to purchase your art."
  },
  { 
    name: "Artist Commission (Retail Production)", 
    studioArtist: "100%", 
    featureArtist: "100%", 
    signatureArtist: "100%",
    description: "After retail production costs, you receive 100% of the profits on all retail production items featuring your artwork. Artists will also receive a distributed share of profits of the Artist 247 ATLAS Genesis book"
  },
  { 
    name: "Artwork Space", 
    studioArtist: "0.75 sqm area", 
    featureArtist: "1 sqm area", 
    signatureArtist: "0.75 sqmm to 1 sqm area",
    description: "The first 50 artists to sign up will recieve larger wall space up to 1 sqm, after that it will be 0.75 sqm.<br /><br />Your wall space is calculated by the size of your artwork, it's your dedicated wall space in our gallery for displaying your artwork. Example: An artwork that is 75cm (0.75m) x 122cm (1.22m) = 0.9 sqm. This fits with the 1 sqm space. See our artwork calculator below."
  },
  { 
    name: "Artworks Per Space", 
    studioArtist: "Up to 2", 
    featureArtist: "Up to 4", 
    signatureArtist: "Up to 4",
    description: "Number of different artworks you can display in your allocated space in the feature gallery. Note: Additional artworks will need to allow spacing. See our artwork size calculator below."
  },
  { 
    name: "Apparel Options", 
    studioArtist: "Full Range", 
    featureArtist: "Full Range", 
    signatureArtist: "Full Range",
    description: "Your artwork can be featured on our complete apparel collection, including t-shirts, hoodies, Totes, and more. We will add new items for your choice.<br /><br />We will also help artists with apparel design where needed. The apparel game is a different beast, and we know how to make the best of it!"
  },
  { 
    name: "Artwork Changes", 
    studioArtist: "1 per Month", 
    featureArtist: "Up to 2 per month", 
    signatureArtist: "2 per month",
    description: "Frequency at which you can rotate or update your displayed artwork. When your artwork sells, we will pack the artwork straight away and ship to your the collector, or, they can take your art on the spot. We will then place one of your stockroom works in place of the sold artwork. You can then add another new work to the stockroom if you choose to do so. We can change out your in-house stockroom works each month to keep the gallery dynamic, or, you can bring in new works to swap around. After all, this IS your gallery"
  },
  { 
    name: "Genesis Artist 'ATLAS' Book", 
    studioArtist: "Single Page", 
    featureArtist: "Double Page spread", 
    signatureArtist: "Double Page spread",
    description: "You will be featured in our Limited Edition 200+ page '247 ATLAS' exhibition coffee table book for collectors and art enthusiasts to enjoy."
  },
  { 
    name: "Priority Art Hanging", 
    studioArtist: "true", 
    featureArtist: "true", 
    signatureArtist: "The first 50 sign-ups",
    description: "Your artwork will be given priority placement during gallery rotations in the exhibition."
  },
  { 
    name: "Artist Care Package", 
    studioArtist: "Single Page", 
    featureArtist: "Double Page spread", 
    signatureArtist: true,
    description: "Each artist will receive 1x 'AP' (Artist Proof) STP Collector pack of their work, 1x 247 ATLAS Limited Edition Artist book."
  },
  { 
    name: "24/7 Video Wall & Projection Profile", 
    studioArtist: "1 rotation every 3", 
    featureArtist: "2 rotations every 3", 
    signatureArtist: true,
    description: "Art Never Sleeps! Your artwork will be featured night and day, 24/7 on our HUGE Video Wall & Projection Space throughout the gallery."
  },
  { 
    name: "Additional Artworks x2 (Stockroom)", 
    studioArtist: true, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Store additional artwork in our upstairs stockroom, available for viewing upon request by interested collectors."
  },
  { 
    name: "24hr Timed Edition Drops", 
    studioArtist: true, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Participate in exclusive 24-hour limited edition releases, a fun and exciting way to find new collectors."
  },
  { 
    name: "Custom Artist 'Link in BIO' Profile URL", 
    studioArtist: true, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Receive a personalized URL '[artistname].247.art' for your online profile, making it easier for collectors to find, follow and purchase your work.<br /><br />As Genesis Artists you will have your online profile foreever and be the first to test & receive any new updates/perks etc"
  },
  { 
    name: "Sculpture Display Option (TBD)", 
    studioArtist: false, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Option to display three-dimensional artwork, expanding the media types you can showcase. There are limited sizes & spots for sculptural works.<br /><br />There will be limited availabilty for sculptural display. Please contact us using the form below for more information"
  },
  { 
    name: "Shop-front Feature Display", 
    studioArtist: false, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Each week we will feature 7 artists on our shopfront, visible to the 50,000 daily passersby on Smith Street each day."
  },
];

export default features;
export type { Feature };

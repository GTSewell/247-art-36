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
    signatureArtist: "$1995",
    description: "One-time payment to join our exclusive artist community. This includes all of your retail print & merch production and stocked in our space, gallery sales staffing, customer relations etc. We will take care of everything for you, including the 5 P's, Printing | Packing | Posting | Payments | and of course any Problems. You focus on creating art, we will take care of the rest.",
    hasDiscount: true
  },
  { 
    name: "Limited Spaces", 
    studioArtist: "50 Artists", 
    featureArtist: "50 Artists", 
    signatureArtist: "12  Artists",
    description: "Limited spaces ensure we can offer personalized attention for the duration of the exhibition."
  },
  { 
    name: "Exhibition Duration", 
    studioArtist: "~100 Days\n(3 months)", 
    featureArtist: "~100 Days\n(3 months)", 
    signatureArtist: "~100 Days (3 months)",
    description: "We believe standard exhibition lengths are too short for maximum impact. You don't see the NGV launch 1 week pop-ups, why? Because the cultural and financial impact in most cases is not worth it. Your work will be displayed in our gallery for approximately 100 days, providing maximum exposure to collectors and art enthusiasts."
  },
  { 
    name: "Gallery Commission (Original Artwork)", 
    studioArtist: "25% to 0%", 
    featureArtist: "10% to 0%", 
    signatureArtist: "0%",
    description: "Gallery commission on sales of original artworks. Studio & Feature Artists can lower their gallery commission to 0% by selling STP Collector packs (See STP below). Lower percentages mean more profit for you as an artist."
  },
  { 
    name: "STP Collector Packs = 0% commission", 
    studioArtist: "25", 
    featureArtist: "10", 
    signatureArtist: "0",
    description: "For every STP Collector pack you sell, 1% is deducted from your gallery commission. Example: If you are a Feature Artist, your gallery commission starts at 10%, if you sell 6x STP Collector packs, your commission is now 4% (10 - 6 = 4).  What is an STP Collector pack? Simple, 'Stickers | T-shirt | Print' with your own individual artist styled packaging. To start, We produce 10x A4 fine art prints for each artist to sign & edition. If you are a Studio Artist the edition minimum is 25, Feature artist, edition minimum 10. All Artists will have an STP pack. Each STP pack will retail at $124.95. You can choose to make the editions larger if you are a high selling artist, Edition 50, 100, 250 etc. Consider STP packs a gateway for the new gen collectors to purchase your art."
  },
  { 
    name: "Artist Commission (Retail Production)", 
    studioArtist: "100%", 
    featureArtist: "100%", 
    signatureArtist: "100%",
    description: "After retail production costs, you receive 100% of the profits on all retail production items featuring your artwork. Artists will also receive a distributed share of 100% profits in the Artist ATLAS Genesis book sales"
  },
  { 
    name: "Artwork Space", 
    studioArtist: "0.75 sqm area", 
    featureArtist: "1 sqm area", 
    signatureArtist: "1 sqm area",
    description: "Your wall space is calculated by the size of your artwork, it's your dedicated wall space in our gallery for displaying your artwork. Example: An artwork that is 75cm (0.75m) x 122cm (1.22m) = 0.9 sqm. This fits with the 1 sqm space. "
  },
  { 
    name: "Artworks Per Space", 
    studioArtist: "Up to 2", 
    featureArtist: "Up to 4", 
    signatureArtist: "Up to 4",
    description: "Number of different artworks you can display in your allocated space. More artworks means greater variety and exposure for your portfolio. If you are a Feature Artist, you can fit up to 4 artworks into your space, as long as it fits with the 1 sqm area. Note: Additional artworks will need to allow spacing. See our artwork size calculator on the Details page."
  },
  { 
    name: "Apparel Options", 
    studioArtist: "Full Range", 
    featureArtist: "Full Range", 
    signatureArtist: "Full Range",
    description: "Your artwork can be featured on our complete apparel collection, including t-shirts, hoodies, Totes, and more. We will add new items for your choice"
  },
  { 
    name: "Artwork Changes", 
    studioArtist: "1 per Month", 
    featureArtist: "Up to 2 per month", 
    signatureArtist: "Up to 4 per month",
    description: "Frequency at which you can rotate or update your displayed artwork. More changes mean more opportunities to showcase your portfolio. We will change out your in-house stockroom works to keep the gallery dynamic"
  },
  { 
    name: "24/7 Video Wall & Projection Profile", 
    studioArtist: "1 rotation every 3", 
    featureArtist: "2 rotations every 3", 
    signatureArtist: "3 rotations every 6",
    description: "Your artwork will be featured night and day, 24/7 on our HUGE Video Wall & Projection Space throughout the gallery. More rotations mean increased visibility for your work."
  },
  { 
    name: "Genesis Artist 'ATLAS' Book", 
    studioArtist: "Single Page", 
    featureArtist: "Double Page spread", 
    signatureArtist: "4 Page Feature",
    description: "Be featured in our exclusive ATLAS hard cover exhibition coffee table book for collectors and art enthusiasts."
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
    description: "Participate in exclusive 24-hour limited edition releases, a fun and exciting way to let the market decide the edition size."
  },
  { 
    name: "Custom Artist 'Link in BIO' Profile URL", 
    studioArtist: true, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Receive a personalized URL '[artistname].247.art' for your online profile, making it easier for collectors to find, follow and purchase your work."
  },
  { 
    name: "Priority Art Hanging", 
    studioArtist: false, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Your artwork will be given priority placement during gallery rotations and exhibitions."
  },
  { 
    name: "Sculpture Display Option (TBD)", 
    studioArtist: false, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Option to display three-dimensional artwork, expanding the media types you can showcase. There are limited sizes & spots for sculptural works"
  },
  { 
    name: "Shop-front Feature Display", 
    studioArtist: false, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Each week 4x Feature Artists will have printed graphics displayed on our shopfront windows, visible to the 50,000 daily passersby on Smith Street each day."
  },
  { 
    name: "Featured Display (1 Week)", 
    studioArtist: false, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Exclusive opportunity on our dedicated feature wall showcasing your work for one week alongside 3 other Feature Artists on our gallery Feature Wall"
  },
];

export default features;
export type { Feature };

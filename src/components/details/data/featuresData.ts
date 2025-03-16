
interface Feature {
  name: string;
  studioArtist: boolean | string;
  featureArtist: boolean | string;
  signatureArtist: boolean | string;
  description?: string;
}

export const features: Feature[] = [
  { 
    name: "Price", 
    studioArtist: "$995", 
    featureArtist: "$1495", 
    signatureArtist: "$1995",
    description: "One-time payment to join our exclusive artist community. This includes all of your retail print & merch production stocked in our space, gallery sales staffing, customer relations etc. We will take care of everything for you, including the 5 P's, Print | Pack | Post | Payments | Problems. You focus on creating art, we will take care of the rest."
  },
  { 
    name: "Limited Spaces", 
    studioArtist: "48 Artists", 
    featureArtist: "36 Artists", 
    signatureArtist: "12  Artists",
    description: "Limited spaces ensure we can offer personalized attention for the duration of the exhibition."
  },
  { 
    name: "Exhibition Duration", 
    studioArtist: "~100 Days (3 months)", 
    featureArtist: "~100 Days (3 months)", 
    signatureArtist: "~100 Days (3 months)",
    description: "We believe standard exhibition lengths are too short for maximum impact. You don't see the NGV launch 1 week pop-ups, why? Becuase the cultural/financial impact to cost is not worth it. Your work will be displayed in our gallery for approximately 100 days, providing maximum exposure to collectors and art enthusiasts."
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
    description: "For every STP Collector pack you sell, 1% is removed from your gallery commission. Example: If you are a Feature Artist, your gallery commission starts at 10%, if you sell 6x STP Collector packs, your commission is now 4% (10-6 = 4).  What is an STP Collector pack? Simple, 'Stickers | T-shirt | Print' with your own individual artist styled packaging. To start, We produce 10x A4 fine art prints for each artist to sign & edition. If you are a Studio Artist the edition minimum is 25, Feature artist, edition minimum 10. All Artists will have an STP pack. Each STP pack will retail at $124.95. You can choose to make the editions larger if you are a high selling artist, Edition 50, 100, 250 etc. Consider STP packs a gateway for the new gen collectors to purchase your art."
  },
  { 
    name: "Artist Commission (Retail Production)", 
    studioArtist: "100%", 
    featureArtist: "100%", 
    signatureArtist: "100%",
    description: "After retail production costs, you receive 100% of the profits on all retail production items featuring your artwork. Artists will also receive profits in the Artist ATLAS Genesis book sales"
  },
  { 
    name: "Artwork Space", 
    studioArtist: "0.75 sqm area", 
    featureArtist: "1 sqm area", 
    signatureArtist: "1 sqm area",
    description: "Your wall space is calculated by the size of your artwork. Example: An artwork that is 75cm (0.75m) x 122cm (1.22m) = 0.9m. This fits with the 1 sqm space.  Dedicated wall space in our gallery for displaying your artwork. More space means more visibility and opportunity to showcase your talent."
  },
  { 
    name: "Artworks Per Space", 
    studioArtist: "1", 
    featureArtist: "Up to 2", 
    signatureArtist: "Up to 4",
    description: "Number of different artworks you can display in your allocated space. More artworks means greater variety and exposure for your portfolio. If you are a Feature or Signature Artist, you can fit more into the space, as long as it fits with the 1 sqm area. Note: Additional artworks will need to allow spacing. See our artwork calculator 'HERE'."
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
    studioArtist: "1 rotation every 6", 
    featureArtist: "2 rotations every 6", 
    signatureArtist: "3 rotations every 6",
    description: "Your artwork will be featured on our digital displays throughout the gallery. More rotations mean increased visibility for your work."
  },
  { 
    name: "Genesis Artist 'ATLAS' Book", 
    studioArtist: "Single Page", 
    featureArtist: "Double Page spread", 
    signatureArtist: "4 Page Feature",
    description: "Be featured in our exclusive ATLAS hard cover exhibition coffee table book for collectors and art enthusiasts. More pages mean more detailed coverage of your work and story."
  },
  { 
    name: "Additional Artworks x2 (Stockroom)", 
    studioArtist: true, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Store additional artwork in our stockroom, available for viewing upon request by interested collectors."
  },
  { 
    name: "24hr Timed Edition Drops", 
    studioArtist: true, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Participate in exclusive 24-hour limited edition releases, creating scarcity and demand for your work."
  },
  { 
    name: "Custom Artist Profile URL", 
    studioArtist: true, 
    featureArtist: true, 
    signatureArtist: true,
    description: "Receive a personalized URL for your online profile, making it easier for collectors to find and follow your work."
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
    description: "Option to display three-dimensional artwork, expanding the media types you can showcase."
  },
  { 
    name: "Shop-front Feature Display", 
    studioArtist: false, 
    featureArtist: false, 
    signatureArtist: true,
    description: "Your artwork will be prominently displayed in our shop window, visible to street traffic and passersby."
  },
  { 
    name: "Solo Exhibition - Feature Wall (1 Week)", 
    studioArtist: false, 
    featureArtist: false, 
    signatureArtist: true,
    description: "Exclusive opportunity to have a dedicated feature wall showcasing your work for one week."
  },
  { 
    name: "Solo Exhibition - Launch Night", 
    studioArtist: false, 
    featureArtist: false, 
    signatureArtist: true,
    description: "Host a special launch event for your exhibition, including invitations to our collector base."
  },
  { 
    name: "Solo Exhibition - Custom Prints/Merch", 
    studioArtist: false, 
    featureArtist: false, 
    signatureArtist: true,
    description: "Create custom merchandise specifically for your solo exhibition, providing additional revenue opportunities."
  },
];

export default features;
export type { Feature };

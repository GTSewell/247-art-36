
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
    description: "One-time payment to join our exclusive artist community. Payment plans are available upon request."
  },
  { 
    name: "Limited Spaces", 
    studioArtist: "48 Artists", 
    featureArtist: "36 Artists", 
    signatureArtist: "12  Artists",
    description: "Limited spaces ensure personalized attention for each artist and maintain exclusivity of the gallery."
  },
  { 
    name: "Exhibition Duration", 
    studioArtist: "~100 Days (3 months)", 
    featureArtist: "~100 Days (3 months)", 
    signatureArtist: "~100 Days (3 months)",
    description: "Your work will be displayed in our gallery for approximately 100 days, providing maximum exposure to collectors and art enthusiasts."
  },
  { 
    name: "Gallery Commission (Original Artwork)", 
    studioArtist: "25% to 0%", 
    featureArtist: "10% to 0%", 
    signatureArtist: "0%",
    description: "Commission percentage taken by the gallery on sales of original artworks. Lower percentages mean more profit for you as an artist."
  },
  { 
    name: "STP Collector Packs = 0% commission", 
    studioArtist: "25", 
    featureArtist: "10", 
    signatureArtist: "0",
    description: "Special Collector Packs available with no commission fees, providing direct profit to artists."
  },
  { 
    name: "Artist Commission (Retail Production)", 
    studioArtist: "100%", 
    featureArtist: "100%", 
    signatureArtist: "100%",
    description: "Receive 100% commission on all retail production items featuring your artwork."
  },
  { 
    name: "Artwork Space", 
    studioArtist: "0.75 sqm", 
    featureArtist: "1 sqm", 
    signatureArtist: "1.2 sqm",
    description: "Dedicated wall space in our gallery for displaying your artwork. More space means more visibility and opportunity to showcase your talent."
  },
  { 
    name: "Artworks Per Space", 
    studioArtist: "1", 
    featureArtist: "Up to 2", 
    signatureArtist: "Up to 4",
    description: "Number of different artworks you can display in your allocated space. More artworks means greater variety and exposure for your portfolio."
  },
  { 
    name: "Apparel Options", 
    studioArtist: "Full Range", 
    featureArtist: "Full Range", 
    signatureArtist: "Full Range",
    description: "Your artwork can be featured on our complete apparel collection, including t-shirts, hoodies, hats, and more."
  },
  { 
    name: "Artwork Changes", 
    studioArtist: "1 per Month", 
    featureArtist: "Up to 4 per month", 
    signatureArtist: "Unlimited",
    description: "Frequency at which you can rotate or update your displayed artwork. More changes mean more opportunities to showcase your portfolio."
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
    featureArtist: "Double Page", 
    signatureArtist: "4 Page Feature",
    description: "Be featured in our exclusive ATLAS publication distributed to collectors and art enthusiasts. More pages mean more detailed coverage of your work and story."
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

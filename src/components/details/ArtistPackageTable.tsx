import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Feature {
  name: string;
  studioArtist: boolean | string;
  featureArtist: boolean | string;
  signatureArtist: boolean | string;
  description?: string; // Optional description for the accordion
}

const features: Feature[] = [
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
    studioArtist: "25%", 
    featureArtist: "10%", 
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

const ArtistPackageTable = () => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index) 
        : [...prev, index]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden rounded-lg shadow-lg"
    >
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-black hover:bg-black" style={{ transition: 'none' }}>
              <TableHead className="text-white">Features</TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-lg text-zap-yellow">Studio Artist</span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-lg text-zap-blue">Feature Artist</span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-lg text-zap-red">Signature Artist</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                <TableRow 
                  className={cn(
                    index % 2 === 0 ? "bg-white" : "bg-gray-50",
                    expandedRows.includes(index) ? "border-b-0" : ""
                  )} 
                  style={{ transition: 'none' }}
                >
                  <TableCell className="font-medium">
                    <div 
                      className="flex items-center justify-between w-full cursor-pointer"
                      onClick={() => toggleRow(index)}
                    >
                      <span>{feature.name}</span>
                      {expandedRows.includes(index) ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {typeof feature.studioArtist === "boolean" ? (
                      feature.studioArtist ? (
                        <Check className="mx-auto text-green-500" />
                      ) : (
                        <X className="mx-auto text-red-500" />
                      )
                    ) : (
                      <span>{feature.studioArtist}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {typeof feature.featureArtist === "boolean" ? (
                      feature.featureArtist ? (
                        <Check className="mx-auto text-green-500" />
                      ) : (
                        <X className="mx-auto text-red-500" />
                      )
                    ) : (
                      <span>{feature.featureArtist}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {typeof feature.signatureArtist === "boolean" ? (
                      feature.signatureArtist ? (
                        <Check className="mx-auto text-green-500" />
                      ) : (
                        <X className="mx-auto text-red-500" />
                      )
                    ) : (
                      <span>{feature.signatureArtist}</span>
                    )}
                  </TableCell>
                </TableRow>
                {/* Expanded content */}
                {expandedRows.includes(index) && feature.description && (
                  <TableRow 
                    className={cn(index % 2 === 0 ? "bg-white" : "bg-gray-50")} 
                    style={{ transition: 'none' }}
                  >
                    <TableCell colSpan={4} className="p-4 pt-0">
                      <div className="text-gray-600 text-sm italic pl-4 pb-2">
                        {feature.description}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
            {/* Secure Your Spot Row with Purchase Buttons */}
            <TableRow className="bg-black hover:bg-black border-t-2 border-gray-700" style={{ transition: 'none' }}>
              <TableCell className="font-bold text-lg py-4 text-white">Secure your spot</TableCell>
              <TableCell className="text-center py-4">
                <Button 
                  className="bg-zap-yellow text-black hover:bg-zap-yellow/80 transition-colors"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase
                </Button>
              </TableCell>
              <TableCell className="text-center py-4">
                <Button 
                  className="bg-zap-blue text-white hover:bg-zap-blue/80 transition-colors"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase
                </Button>
              </TableCell>
              <TableCell className="text-center py-4">
                <Button 
                  className="bg-zap-red text-white hover:bg-zap-red/80 transition-colors"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ArtistPackageTable;


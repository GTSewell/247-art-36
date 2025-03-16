
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Feature {
  name: string;
  studioArtist: boolean | string;
  featureArtist: boolean | string;
  signatureArtist: boolean | string;
}

const features: Feature[] = [
  { name: "Price", studioArtist: "$995", featureArtist: "$1495", signatureArtist: "$1995" },
  { name: "Limited Spaces", studioArtist: "48 Artists", featureArtist: "36 Artists", signatureArtist: "12  Artists" },
  { name: "Exhibition Duration", studioArtist: "~100 Days (3 months)", featureArtist: "~100 Days (3 months)", signatureArtist: "~100 Days (3 months)" },
  { name: "Gallery Commission (Original Artwork)", studioArtist: "25%", featureArtist: "10%", signatureArtist: "0%" },
  { name: "STP Collector Packs = 0% commission", studioArtist: "25", featureArtist: "10", signatureArtist: "0" },
  { name: "Artist Commission (Retail Production)", studioArtist: "100%", featureArtist: "100%", signatureArtist: "100%" },
  { name: "Artwork Space", studioArtist: "0.75 sqm", featureArtist: "1 sqm", signatureArtist: "1.2 sqm" },
  { name: "Artworks Per Space", studioArtist: "1", featureArtist: "Up to 2", signatureArtist: "Up to 4" },
  { name: "Apparel Options", studioArtist: "Full Range", featureArtist: "Full Range", signatureArtist: "Full Range" },
  { name: "Artwork Changes", studioArtist: "1 per Month", featureArtist: "Up to 4 per month", signatureArtist: "Unlimited" },
  { name: "24/7 Video Wall & Projection Profile", studioArtist: "1 rotation every 6", featureArtist: "2 rotations every 6", signatureArtist: "3 rotations every 6" },
  { name: "Genesis Artist 'ATLAS' Book", studioArtist: "Single Page", featureArtist: "Double Page", signatureArtist: "4 Page Feature" },
  { name: "Additional Artworks x2 (Stockroom)", studioArtist: true, featureArtist: true, signatureArtist: true },
  { name: "24hr Timed Edition Drops", studioArtist: true, featureArtist: true, signatureArtist: true },
  { name: "Custom Artist Profile URL", studioArtist: true, featureArtist: true, signatureArtist: true },
  { name: "Priority Art Hanging", studioArtist: false, featureArtist: true, signatureArtist: true },
  { name: "Sculpture Display Option (TBD)", studioArtist: false, featureArtist: true, signatureArtist: true },
  { name: "Shop-front Feature Display", studioArtist: false, featureArtist: false, signatureArtist: true },
  { name: "Solo Exhibition - Feature Wall (1 Week)", studioArtist: false, featureArtist: false, signatureArtist: true },
  { name: "Solo Exhibition - Launch Night", studioArtist: false, featureArtist: false, signatureArtist: true },
  { name: "Solo Exhibition - Custom Prints/Merch", studioArtist: false, featureArtist: false, signatureArtist: true },
];

const ArtistPackageTable = () => {
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
            <TableRow className="bg-black">
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
              <TableRow key={index} className={cn(index % 2 === 0 ? "bg-white" : "bg-gray-50")} style={{ transition: 'none' }}>
                <TableCell className="font-medium">{feature.name}</TableCell>
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
            ))}
            {/* Secure Your Spot Row with Purchase Buttons */}
            <TableRow className="bg-black border-t-2 border-gray-700">
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

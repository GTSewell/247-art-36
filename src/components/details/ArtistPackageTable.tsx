
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  studioArtist: boolean | string;
  featureArtist: boolean | string;
}

const features: Feature[] = [
  { name: "Exhibition Duration", studioArtist: "100 Days (3 months+)", featureArtist: "100 Days (3 months+)" },
  { name: "Gallery Commission on Original Artwork", studioArtist: "25%", featureArtist: "0%" },
  { name: "Artist Commission of RRP on Retail Sales", studioArtist: "30%", featureArtist: "40%" },
  { name: "Artwork Space", studioArtist: "0.75 sqm", featureArtist: "1 sqm" },
  { name: "Artworks Per Space", studioArtist: "1", featureArtist: "Up to 4" },
  { name: "Artwork Changes", studioArtist: "1 per Month", featureArtist: "Unlimited (within reason)" },
  { name: "T-shirt Options", studioArtist: "Black or White only", featureArtist: "Full Color Range" },
  { name: "Video Wall Profile", studioArtist: "1 rotation every 3", featureArtist: "2 rotations every 3" },
  { name: "24hr Timed Edition Drops", studioArtist: true, featureArtist: true },
  { name: "Custom Artist Profile URL", studioArtist: true, featureArtist: true },
  { name: "Priority Art Hanging", studioArtist: false, featureArtist: true },
  { name: "Sculpture Display (40cm x 40cm plinth)", studioArtist: false, featureArtist: true },
  { name: "Retail 'STP' Merch Pack", studioArtist: false, featureArtist: true },
  { name: "247 Artist ATLAS Book + 3 Card Packs", studioArtist: false, featureArtist: true },
  { name: "Shop-front Feature Display", studioArtist: false, featureArtist: true },
  { name: "Custom Embosser for Prints", studioArtist: false, featureArtist: true },
  { name: "Specialty Sticker Options", studioArtist: false, featureArtist: true },
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
            <TableRow className="bg-gray-800">
              <TableHead className="text-white">Features</TableHead>
              <TableHead className="text-center text-white">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-lg">Studio Artist</span>
                  <span className="text-yellow-400 font-bold">$995</span>
                </div>
              </TableHead>
              <TableHead className="text-center text-white">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-lg">Feature Artist</span>
                  <span className="text-yellow-400 font-bold">$1,495</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index} className={cn(index % 2 === 0 ? "bg-white" : "bg-gray-50")}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ArtistPackageTable;

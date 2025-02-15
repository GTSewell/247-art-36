
import React from 'react';
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface TimedEditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
}

const TimedEditionModal: React.FC<TimedEditionModalProps> = ({
  isOpen,
  onClose,
  product,
  timeLeft
}) => {
  // Generate variation images based on the main image
  const variations = Array(4).fill(product?.image_url);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[800px] p-0 border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ScrollArea className="h-full w-full rounded-md p-6">
          <SheetHeader className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{product?.name}</h2>
                <p className="text-muted-foreground">By {product?.artists?.name}</p>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-8">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-2">
              {variations.map((image, index) => (
                <div key={index} className="relative aspect-square rounded overflow-hidden">
                  <img
                    src={image}
                    alt={`Variation ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <p className="text-muted-foreground">{product?.description}</p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Specifications</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Signed and numbered by the artist</li>
                <li>• 310gsm 100% cotton-rag</li>
                <li>• 200yr archival inks</li>
                <li>• Embossed</li>
                <li>• NFC chipped</li>
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-yellow-800">
                    Final edition count is determined on the conclusion of the countdown.
                  </p>
                  <p className="text-sm text-yellow-700">
                    As we need to run production and organize artist/s to sign. Expect arrival of your artwork up to 8 weeks. 
                    (Though, we'll do our best to make that happen waaay quicker!)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TimedEditionModal;

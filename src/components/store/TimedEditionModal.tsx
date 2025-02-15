
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimedEditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  timeLeft: TimerState;
}

const TimedEditionModal: React.FC<TimedEditionModalProps> = ({
  isOpen,
  onClose,
  product,
  timeLeft
}) => {
  const variations = Array(4).fill(product?.image_url);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          <div className="w-full md:w-1/2 p-6">
            <div className="grid grid-cols-2 gap-2 h-full">
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
          </div>
          <div className="w-full md:w-1/2 border-l border-border/40 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{product?.name}</h2>
                  <p className="text-muted-foreground">By {product?.artists?.name}</p>
                </div>
                {timeLeft && product && (
                  <CountdownTimer 
                    initialHours={timeLeft.hours}
                    initialMinutes={timeLeft.minutes}
                    initialSeconds={timeLeft.seconds}
                    productId={product.id}
                  />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <p className="text-muted-foreground">
                  {product?.description || "Discover this exclusive limited edition print, meticulously crafted to capture the essence of contemporary artistry. Each piece is individually numbered and personally signed by the artist, making it a unique addition to any collection."}
                </p>
              </div>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimedEditionModal;


import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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

  // Add the CountdownTimer component from GeneralStore page
  const CountdownTimer = ({ initialHours, initialMinutes, initialSeconds }: {
    initialHours: number;
    initialMinutes: number;
    initialSeconds: number;
  }) => {
    const [time, setTime] = useState({
      hours: initialHours,
      minutes: initialMinutes,
      seconds: initialSeconds
    });
    const [isExpired, setIsExpired] = useState(false);

    const getColorScheme = () => {
      const totalMinutes = time.hours * 60 + time.minutes;
      
      if (isExpired) {
        return {
          text: "text-red-500",
          border: "border-red-500",
          shadow: "rgba(239, 63, 54, 0.8)",
          animation: "red-pulse"
        };
      }
      
      if (totalMinutes >= 720) {
        return {
          text: "text-zap-blue",
          border: "border-zap-blue",
          shadow: "rgba(0, 122, 255, 0.8)",
          animation: "blue-pulse"
        };
      } else if (totalMinutes >= 360) {
        return {
          text: "text-zap-yellow",
          border: "border-zap-yellow",
          shadow: "rgba(255, 204, 0, 0.8)",
          animation: "yellow-pulse"
        };
      } else {
        return {
          text: "text-red-500",
          border: "border-red-500",
          shadow: "rgba(239, 63, 54, 0.8)",
          animation: "red-pulse"
        };
      }
    };

    useEffect(() => {
      const timer = setInterval(() => {
        setTime(prev => {
          if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
            clearInterval(timer);
            setIsExpired(true);
            return prev;
          }
          let newSeconds = prev.seconds - 1;
          let newMinutes = prev.minutes;
          let newHours = prev.hours;
          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }
          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }
          return {
            hours: newHours,
            minutes: newMinutes,
            seconds: newSeconds
          };
        });
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');
    const colorScheme = getColorScheme();

    return (
      <div 
        style={{
          textShadow: `0 0 7px ${colorScheme.shadow}, 0 0 10px ${colorScheme.shadow}, 0 0 21px ${colorScheme.shadow}`,
          fontSize: '1.5rem',
          letterSpacing: '2px',
          animation: `${colorScheme.animation} 2s infinite`,
          width: '140px',
        }} 
        className={`bg-black border-2 ${colorScheme.border} ${colorScheme.text} flex items-center justify-center gap-1 font-digital rounded-none px-2 py-1`}
      >
        <style>
          {`
            @keyframes blue-pulse {
              0% { border-color: rgba(0, 122, 255, 0.3); }
              50% { border-color: rgba(0, 122, 255, 1); }
              100% { border-color: rgba(0, 122, 255, 0.3); }
            }
            @keyframes yellow-pulse {
              0% { border-color: rgba(255, 204, 0, 0.3); }
              50% { border-color: rgba(255, 204, 0, 1); }
              100% { border-color: rgba(255, 204, 0, 0.3); }
            }
            @keyframes red-pulse {
              0% { border-color: rgba(239, 63, 54, 0.3); }
              50% { border-color: rgba(239, 63, 54, 1); }
              100% { border-color: rgba(239, 63, 54, 0.3); }
            }
          `}
        </style>
        <span className="w-full text-center">
          {isExpired ? "CLOSED" : `${formatNumber(time.hours)}:${formatNumber(time.minutes)}:${formatNumber(time.seconds)}`}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Left side - Image Grid */}
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

          {/* Right side - Details */}
          <div className="w-full md:w-1/2 border-l border-border/40 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Header with Timer */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{product?.name}</h2>
                  <p className="text-muted-foreground">By {product?.artists?.name}</p>
                </div>
                {timeLeft && (
                  <CountdownTimer 
                    initialHours={timeLeft.hours}
                    initialMinutes={timeLeft.minutes}
                    initialSeconds={timeLeft.seconds}
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <p className="text-muted-foreground">
                  {product?.description || "Discover this exclusive limited edition print, meticulously crafted to capture the essence of contemporary artistry. Each piece is individually numbered and personally signed by the artist, making it a unique addition to any collection. This stunning artwork showcases the perfect blend of traditional craftsmanship and modern artistic vision, printed on museum-quality cotton rag paper to ensure unparalleled depth and longevity."}
                </p>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimedEditionModal;

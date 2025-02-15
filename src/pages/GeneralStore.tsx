import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Hourglass } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import TimedEditionModal from "@/components/store/TimedEditionModal";

interface CountdownTimerProps {
  initialHours: number;
  initialMinutes: number;
  initialSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialHours, initialMinutes, initialSeconds }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  const [isExpired, setIsExpired] = useState(false);

  const getColorScheme = () => {
    const totalMinutes = timeLeft.hours * 60 + timeLeft.minutes;
    
    if (isExpired) {
      return {
        text: "text-red-500",
        border: "border-red-500",
        shadow: "rgba(239, 63, 54, 0.8)",
        animation: "red-pulse"
      };
    }
    
    if (totalMinutes >= 720) { // 12 hours or more
      return {
        text: "text-zap-blue",
        border: "border-zap-blue",
        shadow: "rgba(0, 122, 255, 0.8)",
        animation: "blue-pulse"
      };
    } else if (totalMinutes >= 360) { // 6 hours or more
      return {
        text: "text-zap-yellow",
        border: "border-zap-yellow",
        shadow: "rgba(255, 204, 0, 0.8)",
        animation: "yellow-pulse"
      };
    } else { // Less than 6 hours
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
      setTimeLeft(prev => {
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
        {isExpired ? "CLOSED" : `${formatNumber(timeLeft.hours)}:${formatNumber(timeLeft.minutes)}:${formatNumber(timeLeft.seconds)}`}
      </span>
    </div>
  );
};

const GeneralStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<'print' | 'merch' | 'sticker'>('print');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTimerState, setSelectedTimerState] = useState<any>(null);
  
  const {
    data: products,
    isLoading
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('products').select('*, artists(name, image)').order('created_at', {
        ascending: false
      });
      if (error) {
        toast.error("Failed to load products");
        throw error;
      }
      return data;
    }
  });

  const featuredProducts = products?.filter(p => p.is_featured) || [];
  const filteredProducts = products?.filter(p => p.category === selectedCategory).slice(0, 16) || [];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  const getInitialTime = (index: number) => {
    switch (index) {
      case 0:
        return { initialHours: 0, initialMinutes: 0, initialSeconds: 33 };
      case 1:
        return { initialHours: 6, initialMinutes: 0, initialSeconds: 20 };
      case 2:
        return { initialHours: 12, initialMinutes: 1, initialSeconds: 10 };
      default:
        return { 
          initialHours: Math.floor(Math.random() * 24), 
          initialMinutes: Math.floor(Math.random() * 60), 
          initialSeconds: Math.floor(Math.random() * 60) 
        };
    }
  };

  return <div className="min-h-screen bg-zap-red">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Hourglass className="text-zap-yellow" />
            Timed Edition Drops
          </h2>
          <Carousel className="relative">
            <CarouselContent>
              {featuredProducts.map((product, index) => {
                const initialTime = getInitialTime(index);
                return (
                  <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                    <div 
                      className="relative group overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedTimerState(initialTime);
                      }}
                    >
                      <div className="absolute top-4 right-4 z-10">
                        <CountdownTimer
                          initialHours={initialTime.hours}
                          initialMinutes={initialTime.minutes}
                          initialSeconds={initialTime.seconds}
                        />
                      </div>
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image_url || '/placeholder.svg'} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                          onError={handleImageError} 
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-lg font-bold mb-1">{product.name}</h3>
                          <p className="text-white/90">${product.price}</p>
                          <Button className="w-full mt-2 bg-zap-red hover:bg-zap-blue">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <TimedEditionModal
          isOpen={!!selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setSelectedTimerState(null);
          }}
          product={selectedProduct}
          timeLeft={selectedTimerState}
        />

        <section className="mb-8">
          <div className="flex gap-4 justify-center">
            <Button variant={selectedCategory === 'print' ? 'default' : 'outline'} onClick={() => setSelectedCategory('print')} className="min-w-[120px]">
              Prints
            </Button>
            <Button variant={selectedCategory === 'merch' ? 'default' : 'outline'} onClick={() => setSelectedCategory('merch')} className="min-w-[120px]">
              Merch
            </Button>
            <Button variant={selectedCategory === 'sticker' ? 'default' : 'outline'} onClick={() => setSelectedCategory('sticker')} className="min-w-[120px]">
              Stickers
            </Button>
          </div>
        </section>

        <section>
          <ScrollArea className="h-[800px] rounded-md border-4 border-black p-4 bg-zap-yellow py-[32px] px-[32px]">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => <div key={product.id} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                    <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={handleImageError} />
                    {product.is_limited_edition && <div className="absolute top-2 right-2">
                        <div className="bg-zap-yellow text-black px-2 py-1 rounded-full flex items-center gap-1">
                          <Zap size={14} />
                          <span className="text-xs font-medium">Limited</span>
                        </div>
                      </div>}
                  </div>
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">${product.price}</p>
                    <Button size="sm" className="bg-zap-red hover:bg-zap-blue">
                      <Zap className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                  {product.artists && <p className="text-sm text-gray-500 mt-2">
                      By {product.artists.name}
                    </p>}
                </div>)}
            </div>
          </ScrollArea>
        </section>

        {isLoading && <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-zap-blue">Loading products...</div>
          </div>}
      </main>
    </div>;
};

export default GeneralStore;

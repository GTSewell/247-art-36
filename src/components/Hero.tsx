
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Hero = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('PWA installation prompt captured');
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      setIsClicked(true);
      console.log('App is already in standalone mode');
    }
    const isStandalone = (window.navigator as any).standalone;
    if (isStandalone === true || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      setIsClicked(true);
      console.log('App is in standalone mode (iOS or Android)');
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    setIsClicked(true);
    if (!deferredPrompt) {
      toast.info("You can install this app by tapping the browser menu and selecting 'Add to Home Screen'", {
        duration: 5000
      });
      return;
    }
    try {
      deferredPrompt.prompt();
      const {
        outcome
      } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success("ZAP! has been installed successfully!");
        setDeferredPrompt(null);
        setIsInstallable(false);
      } else {
        toast.info("Installation cancelled");
        setIsClicked(false);
      }
    } catch (error) {
      console.error('Installation error:', error);
      toast.error("There was a problem installing the app");
      setIsClicked(false);
    }
  };

  return <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      </div>

      <div className="absolute inset-0">
        <img src="/lovable-uploads/5275fee6-9936-449c-bb71-730600ae1475.png" alt="Halftone Pattern" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-24 md:pt-28">
        <motion.div initial={{
        scale: 0.5,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 0.5
      }} className="inline-block">
          <img src="/lovable-uploads/59a6f684-31db-4ac2-a157-a94968384f00.png" alt="ZAP!" className="h-32 md:h-48 mx-auto animate-float" />
        </motion.div>
        
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2,
        duration: 0.5
      }} className="mt-4 w-full px-4 md:px-0 max-w-md">
          <div className="bg-zap-red py-4 px-4 md:px-8 rounded-lg w-full">
            <p className="text-xl md:text-2xl font-extrabold text-white text-center">
              Home for the NEXT GEN Artist & NEW GEN Collector
            </p>
          </div>
        </motion.div>
        
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.3,
        duration: 0.5
      }} className="mt-6 text-xl md:text-2xl text-gray-600 max-w-md mx-auto font-bold text-center px-4 md:px-0 w-full">
          <p className="mb-6 font-extrabold uppercase">IT'S TIME FOR A REVOLUTION IN THE ART WORLD ...</p>
          
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.4,
          duration: 0.5
        }} className="w-full max-w-md">
            <div className="bg-zap-blue py-4 px-4 md:px-8 rounded-lg w-full">
              <p className="text-xl md:text-2xl font-extrabold text-white text-center">
                <span>100 ARTISTS TO EXHIBIT</span>
                <span className="block mt-1">100 DAY IRL EXHIBITION</span>
              </p>
            </div>
          </motion.div>
          
          <p className="font-extrabold mt-6">YOU CREATE. WE CREATE. TOGETHER WE KICK ASS!</p>
        </motion.div>

        <motion.div initial={{
        y: 40,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.6,
        duration: 0.5
      }} className="w-full mt-12 px-4 md:px-8 flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src="/lovable-uploads/6acfd1a8-557c-46d1-8723-9a2de5589601.png" alt="Gallery Commission" className="w-full h-auto" />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src="/lovable-uploads/36943b5d-defa-44e3-b4d3-0c03082b4abe.png" alt="Artist Profile" className="w-full h-auto" />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src="/lovable-uploads/7ab2b4e1-a00b-4cd8-b039-5863c96b000f.png" alt="Artist Dashboard" className="w-full h-auto" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{
        y: 40,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.8,
        duration: 0.5
      }} className="w-full mt-6 px-4 md:px-8 flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src="/lovable-uploads/91d913c0-84aa-4722-a729-eddcbe1386cb.png" alt="World Class Exhibition Space" className="w-full h-auto" />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src="/lovable-uploads/ee6879a0-42e7-4b20-bd65-45c5dedecef9.png" alt="Fine Art Print House" className="w-full h-auto" />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src="/lovable-uploads/3e059aec-6e10-4d98-8e77-940f0edd0dd9.png" alt="STP: Stickers | T-Shirt | Print" className="w-full h-auto" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
};

export default Hero;

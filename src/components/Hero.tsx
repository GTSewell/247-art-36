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
      const { outcome } = await deferredPrompt.userChoice;
      
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-zap-yellow">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="absolute inset-0">
        <img src="/lovable-uploads/e16074dd-11b0-4f2e-bcc8-06b5fa6c282a.png" alt="Halftone Pattern" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-24 md:pt-28">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          <img 
            src="/lovable-uploads/59a6f684-31db-4ac2-a157-a94968384f00.png" 
            alt="ZAP!" 
            className="h-32 md:h-48 mx-auto animate-float"
          />
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-bold text-center"
        >
          <p className="mb-6">It's time for a revolution in the art world!</p>
          <p className="font-extrabold">YOU CREATE. WE CREATE. TOGETHER WE KICK ASS!</p>
        </motion.div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full mt-12 px-4 md:px-8 flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/lovable-uploads/7ab2b4e1-a00b-4cd8-b039-5863c96b000f.png" 
                alt="Artist Dashboard" 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/lovable-uploads/36943b5d-defa-44e3-b4d3-0c03082b4abe.png" 
                alt="Artist Profile" 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/lovable-uploads/69af7803-27d7-4f04-b312-6169327229b3.png" 
                alt="Gallery Commission" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full mt-6 px-4 md:px-8 flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/lovable-uploads/65260f29-6ff3-4908-ab60-966d152fd537.png" 
                alt="World Class Exhibition Space" 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/lovable-uploads/ee6879a0-42e7-4b20-bd65-45c5dedecef9.png" 
                alt="Fine Art Print House" 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/lovable-uploads/3e059aec-6e10-4d98-8e77-940f0edd0dd9.png" 
                alt="STP: Stickers | T-Shirt | Print" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

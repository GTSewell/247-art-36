
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAppMode } from "@/contexts/AppModeContext";

import Index from "@/pages/Index";
import Artists from "@/pages/Artists";
import Auth from "@/pages/Auth";
import Details from "@/pages/Details";
import Services from "@/pages/Services";
import WhoAreYou from "@/pages/WhoAreYou";
import VirtualTour from "@/pages/VirtualTour";
import GeneralStore from "@/pages/GeneralStore";
import ArtistSubdomain from "@/pages/ArtistSubdomain";
import NotFound from "@/pages/NotFound";
import ArtistSubmission from "@/pages/ArtistSubmission";

// PWA specific pages
import PWAHome from "@/pages/pwa/PWAHome";
import PWAArtists from "@/pages/pwa/PWAArtists";
import PWAStore from "@/pages/pwa/PWAStore";
import ArtistDashboard from "@/pages/pwa/ArtistDashboard";
import CollectorDashboard from "@/pages/pwa/CollectorDashboard";

import "./App.css";

function App() {
  const location = useLocation();
  const { isPWA } = useAppMode();
  
  // Add data-pwa attribute to body when in PWA mode
  useEffect(() => {
    if (isPWA) {
      document.body.setAttribute('data-pwa', 'true');
    } else {
      document.body.removeAttribute('data-pwa');
    }
  }, [isPWA]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={isPWA ? <PWAHome /> : <Index />} 
        />
        <Route 
          path="/artists" 
          element={isPWA ? <PWAArtists /> : <Artists />} 
        />
        <Route 
          path="/store" 
          element={isPWA ? <PWAStore /> : <GeneralStore />} 
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/details" element={<Details />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tour" element={<VirtualTour />} />
        <Route path="/who-are-you" element={<WhoAreYou />} />
        <Route path="/submit" element={<ArtistSubmission />} />
        
        {/* Dashboard routes */}
        <Route path="/dashboard/artist" element={<ArtistDashboard />} />
        <Route path="/dashboard/collector" element={<CollectorDashboard />} />
        
        {/* Artist subdomain route - using artistName as parameter name for consistency */}
        <Route path="/artists/:artistName" element={<ArtistSubdomain />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;

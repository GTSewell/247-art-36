
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAppMode } from "@/contexts/AppModeContext";
import { CartProvider } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SitePassword } from "@/components/SitePassword";
import { usePasswordProtection } from "@/contexts/PasswordProtectionContext";
import MessageDetails from "@/pages/MessageDetails";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

import Index from "@/pages/Index";
import NewIndex from "@/pages/NewIndex";
import Artists from "@/pages/Artists";
import Auth from "@/pages/Auth";
import Details from "@/pages/Details";
import Services from "@/pages/Services";
import WhoAreYou from "@/pages/WhoAreYou";
import VirtualTour from "@/pages/VirtualTour";
import GeneralStore from "@/pages/GeneralStore";
import Cart from "@/pages/Cart";
import Messages from "@/pages/Messages";
import ArtistSubdomain from "@/pages/ArtistSubdomain";
import NotFound from "@/pages/NotFound";
import ArtistSubmission from "@/pages/ArtistSubmission";
import TallyFormPage from "@/pages/TallyFormPage";
import LFG from "@/pages/LFG"; // Import the new LFG page

// Admin pages
import ArtistManagement from "@/pages/admin/ArtistManagement";
import ShopifyAdmin from "@/pages/admin/ShopifyAdmin";

// PWA specific pages
import PWAHome from "@/pages/pwa/PWAHome";
import PWAArtists from "@/pages/pwa/PWAArtists";
import PWAStore from "@/pages/pwa/PWAStore";
import ArtistDashboard from "@/pages/pwa/ArtistDashboard";
import CollectorDashboard from "@/pages/pwa/CollectorDashboard";
import AccountPage from "@/pages/pwa/AccountPage";

import "./App.css";

const App = () => {
  const location = useLocation();
  const { isPWA } = useAppMode();
  const isMobile = useIsMobile();
  const { isPasswordCorrect, setIsPasswordCorrect } = usePasswordProtection();
  
  // Use PWA UI for mobile devices, but only if it's actually installed as a PWA
  const usePWAUI = isPWA;
  
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

  // Password protection disabled - uncomment below to re-enable
  // if (!isPasswordCorrect) {
  //   return <SitePassword setIsPasswordCorrect={setIsPasswordCorrect} />;
  // }

  return (
    <CartProvider>
      <Routes>
        <Route 
          path="/" 
          element={usePWAUI ? <PWAHome /> : <NewIndex />} 
        />
        <Route 
          path="/artists" 
          element={usePWAUI ? <PWAArtists /> : <Artists />} 
        />
        <Route 
          path="/store" 
          element={usePWAUI ? <PWAStore /> : <GeneralStore />} 
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:messageId" element={<MessageDetails />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/details" element={<Details />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tour" element={<VirtualTour />} />
        <Route path="/virtual-tour" element={<VirtualTour />} />
        <Route path="/who-are-you" element={<WhoAreYou />} />
        <Route path="/submit" element={<ArtistSubmission />} />
        <Route path="/lfg" element={<LFG />} /> {/* Add the new LFG route */}
        
        {/* Admin routes */}
        <Route 
          path="/admin/artists" 
          element={
            <AdminProtectedRoute>
              <ArtistManagement />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/shopify" 
          element={
            <AdminProtectedRoute>
              <ShopifyAdmin />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Tally Form Page - hidden from navigation */}
        <Route path="/artistsubform" element={<TallyFormPage />} />
        
        {/* Account and Dashboard routes */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/dashboard/artist" element={<ArtistDashboard />} />
        <Route path="/dashboard/collector" element={<CollectorDashboard />} />
        
        {/* Artist subdomain route - using artistName as parameter name for consistency */}
        <Route path="/artists/:artistName" element={<ArtistSubdomain />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster position="bottom-center" />
    </CartProvider>
  );
};

export default App;

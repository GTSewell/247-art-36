
import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import WhoAreYou from "./pages/WhoAreYou";
import VirtualTour from "./pages/VirtualTour";
import Artists from "./pages/Artists";
import Services from "./pages/Services";
import Details from "./pages/Details";
import Auth from "./pages/Auth";
import GeneralStore from "./pages/GeneralStore";
import NotFound from "./pages/NotFound";
import ArtistSubmission from "./pages/ArtistSubmission";
import { Toaster } from "sonner";
import { SitePassword } from "./components/SitePassword";
import ArtistSubdomain from "./pages/ArtistSubdomain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { logger } from "./utils/logger";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(
    localStorage.getItem("isPasswordCorrect") === "true"
  );
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Log app initialization
    logger.info("App component mounted");
    
    localStorage.setItem("isPasswordCorrect", String(isPasswordCorrect));
    
    // Remove dark mode class from document - let artists page manage it locally
    document.documentElement.classList.remove('dark');
    
    // Log the current PWA state
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    logger.info('App initialized in mode:', isPWA ? 'PWA/standalone' : 'browser');
    
    // Enhanced CSS to hide the "Fix Image URLs" button with more specific selectors
    const style = document.createElement('style');
    style.textContent = `
      /* Hide buttons with download icon */
      button:has(svg[data-lucide="download"]),
      a:has(svg[data-lucide="download"]),
      
      /* Hide buttons with specific text content */
      button:has(span:contains("Fix Image")),
      a:has(span:contains("Fix Image")),
      button:has(div:contains("Fix Image")),
      a:has(div:contains("Fix Image")),
      
      /* Target by direct text content */
      button:contains("Fix Image"),
      a:contains("Fix Image"),
      
      /* Target elements with specific classes or IDs */
      [class*="fix-image"], 
      [class*="download-artist"], 
      [class*="artist-download"],
      [id*="fix-image"], 
      [id*="download-artist"],
      [id*="artist-download"],
      
      /* Additional selectors to catch the button */
      .artistImageBtn,
      .downloadBtn,
      [data-testid="fix-image-btn"],
      [aria-label*="Fix Image"],
      [title*="Fix Image"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        position: absolute !important;
        pointer-events: none !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
    
    // Mark app as ready after a short delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setAppReady(true);
      logger.info("App marked as ready");
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isPasswordCorrect]);

  // Handle initial loading state
  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading ZAP...</p>
      </div>
    );
  }

  if (!isPasswordCorrect) {
    return <SitePassword setIsPasswordCorrect={setIsPasswordCorrect} />;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/who-are-you" element={<WhoAreYou />} />
            <Route path="/virtual-tour" element={<VirtualTour />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:artistName" element={<ArtistSubdomain />} />
            <Route path="/services" element={<Services />} />
            <Route path="/details" element={<Details />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/store" element={<GeneralStore />} />
            <Route path="/artist-submission" element={<ArtistSubmission />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors />
      </QueryClientProvider>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Log page navigation for debugging
    logger.info(`Navigated to: ${pathname}`);
  }, [pathname]);

  return null;
}

export default App;

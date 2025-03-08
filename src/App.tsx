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
import { AppModeProvider, useAppMode } from "./contexts/AppModeContext";
import ArtistDashboard from "./pages/pwa/ArtistDashboard";
import PWAHome from "./pages/pwa/PWAHome";
import PWAArtists from "./pages/pwa/PWAArtists";
import CollectorDashboard from "./pages/pwa/CollectorDashboard";

const queryClient = new QueryClient();

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppModeProvider>
        <AppContent />
      </AppModeProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(
    localStorage.getItem("isPasswordCorrect") === "true"
  );
  const [appReady, setAppReady] = useState(false);
  const { isPWA } = useAppMode();

  useEffect(() => {
    logger.info("App component mounted");
    localStorage.setItem("isPasswordCorrect", String(isPasswordCorrect));
    document.documentElement.classList.remove('dark');
    logger.info('App initialized in mode:', isPWA ? 'PWA/standalone' : 'browser');
    const style = document.createElement('style');
    style.textContent = `
      button:has(svg[data-lucide="download"]),
      a:has(svg[data-lucide="download"]),
      button:has(span:contains("Fix Image")),
      a:has(span:contains("Fix Image")),
      button:has(div:contains("Fix Image")),
      a:has(div:contains("Fix Image")),
      button:contains("Fix Image"),
      a:contains("Fix Image"),
      [class*="fix-image"], 
      [class*="download-artist"], 
      [class*="artist-download"],
      [id*="fix-image"], 
      [id*="download-artist"],
      [id*="artist-download"],
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
    const timer = setTimeout(() => {
      setAppReady(true);
      logger.info("App marked as ready");
    }, 100);
    return () => clearTimeout(timer);
  }, [isPasswordCorrect, isPWA]);

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
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={isPWA ? <PWAHome /> : <Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/artists" element={isPWA ? <PWAArtists /> : <Artists />} />
        <Route path="/who-are-you" element={<WhoAreYou />} />
        <Route path="/services" element={<Services />} />
        <Route path="/store" element={<GeneralStore />} />
        <Route path="/details" element={<Details />} />
        <Route path="/virtual-tour" element={<VirtualTour />} />
        <Route path="/artist-submission" element={<ArtistSubmission />} />
        <Route path="/dashboard/artist" element={<ArtistDashboard />} />
        <Route path="/dashboard/collector" element={<CollectorDashboard />} />
        <Route path="/artist/:artistName" element={<ArtistSubdomain />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    logger.info(`Navigated to: ${pathname}`);
  }, [pathname]);

  return null;
}

export default AppWrapper;


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
import PWAStore from "./pages/pwa/PWAStore";
import CollectorDashboard from "./pages/pwa/CollectorDashboard";
import { isLovablePreview } from "./utils/environmentDetector";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a new query client with retry disabled
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: isLovablePreview() ? false : 3, // Disable retries in preview mode
      staleTime: isLovablePreview() ? 0 : 5 * 60 * 1000, // Shorter stale time in preview
    },
  },
});

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
    localStorage.getItem("isPasswordCorrect") === "true" || isLovablePreview()
  );
  const [appReady, setAppReady] = useState(false);
  const { isPWA, isPreview } = useAppMode();

  useEffect(() => {
    try {
      logger.info("App component mounted", { isPWA, isPreview, isPasswordCorrect });
      
      // Always bypass password in preview mode
      if (isPreview && !isPasswordCorrect) {
        logger.info("Bypassing password in preview mode");
        setIsPasswordCorrect(true);
      } else {
        localStorage.setItem("isPasswordCorrect", String(isPasswordCorrect));
      }
      
      document.documentElement.classList.remove('dark');
      logger.info('App initialized in mode:', isPWA ? 'PWA/standalone' : isPreview ? 'preview' : 'browser');
      
      // CSS to hide download-related elements
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
      
      // Short delay to ensure everything is initialized
      const timer = setTimeout(() => {
        setAppReady(true);
        logger.info("App marked as ready");
      }, 100);
      
      return () => {
        clearTimeout(timer);
        logger.info("App component unmounting");
      };
    } catch (error) {
      logger.error("Error in App initialization:", error);
      setAppReady(true); // Still mark as ready to allow error boundary to catch
    }
  }, [isPasswordCorrect, isPWA, isPreview]);

  // Simple loading state if not ready
  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading ZAP...</p>
      </div>
    );
  }

  // Password gate (bypassed in preview mode)
  if (!isPasswordCorrect) {
    return (
      <ErrorBoundary fallback={<div className="p-4">Error in password component. Refresh to try again.</div>}>
        <SitePassword setIsPasswordCorrect={setIsPasswordCorrect} />
      </ErrorBoundary>
    );
  }

  // Main app routing with error boundaries for better isolation
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <ErrorBoundary>
              {isPWA ? <PWAHome /> : <Index />}
            </ErrorBoundary>
          } />
          <Route path="/auth" element={
            <ErrorBoundary>
              <Auth />
            </ErrorBoundary>
          } />
          <Route path="/artists" element={
            <ErrorBoundary>
              {isPWA ? <PWAArtists /> : <Artists />}
            </ErrorBoundary>
          } />
          <Route path="/who-are-you" element={
            <ErrorBoundary>
              <WhoAreYou />
            </ErrorBoundary>
          } />
          <Route path="/services" element={
            <ErrorBoundary>
              <Services />
            </ErrorBoundary>
          } />
          <Route path="/store" element={
            <ErrorBoundary>
              {isPWA ? <PWAStore /> : <GeneralStore />}
            </ErrorBoundary>
          } />
          <Route path="/details" element={
            <ErrorBoundary>
              <Details />
            </ErrorBoundary>
          } />
          <Route path="/virtual-tour" element={
            <ErrorBoundary>
              <VirtualTour />
            </ErrorBoundary>
          } />
          <Route path="/artist-submission" element={
            <ErrorBoundary>
              <ArtistSubmission />
            </ErrorBoundary>
          } />
          <Route path="/dashboard/artist" element={
            <ErrorBoundary>
              <ArtistDashboard />
            </ErrorBoundary>
          } />
          <Route path="/dashboard/collector" element={
            <ErrorBoundary>
              <CollectorDashboard />
            </ErrorBoundary>
          } />
          <Route path="/artists/:artistName" element={
            <ErrorBoundary>
              <ArtistSubdomain />
            </ErrorBoundary>
          } />
          <Route path="*" element={
            <ErrorBoundary>
              <NotFound />
            </ErrorBoundary>
          } />
        </Routes>
        <Toaster richColors />
      </ErrorBoundary>
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

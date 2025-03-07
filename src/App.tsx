
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
import { TimerProvider } from "./contexts/TimerContext";

// Create a client with more robust error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">We've encountered an error. Please try refreshing the page.</p>
          <p className="text-sm text-gray-500">{this.state.error?.message}</p>
          <button 
            className="mt-4 px-4 py-2 bg-black text-white rounded"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(
    localStorage.getItem("isPasswordCorrect") === "true"
  );

  useEffect(() => {
    // Store password status
    localStorage.setItem("isPasswordCorrect", String(isPasswordCorrect));
    
    // Remove dark mode class from document - let artists page manage it locally
    document.documentElement.classList.remove('dark');
    
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
    
    // Console log for debugging
    console.log("App initialized with password status:", isPasswordCorrect);
  }, [isPasswordCorrect]);

  if (!isPasswordCorrect) {
    return <SitePassword setIsPasswordCorrect={setIsPasswordCorrect} />;
  }

  return (
    <React.Fragment>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TimerProvider>
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
          </TimerProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Fragment>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Details from "./pages/Details";
import Artists from "./pages/Artists";
import ArtistSubmission from "./pages/ArtistSubmission";
import WhoAreYou from "./pages/WhoAreYou";
import GeneralStore from "./pages/GeneralStore";
import VirtualTour from "./pages/VirtualTour";
import Auth from "./pages/Auth";
import ArtistSubdomain from "./pages/ArtistSubdomain";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./App.css";

// Detect if we're on an artist subdomain
const hostname = window.location.hostname;
const isArtistSubdomain =
  hostname.includes(".") &&
  hostname.split(".").length >= 2 &&
  !hostname.startsWith("www") &&
  !hostname.startsWith("staging") &&
  !hostname.startsWith("dev");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  if (isArtistSubdomain) {
    return (
      <QueryClientProvider client={queryClient}>
        <ArtistSubdomain />
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/details" element={<Details />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/submit-artist" element={<ArtistSubmission />} />
            <Route path="/whoareyou" element={<WhoAreYou />} />
            <Route path="/store" element={<GeneralStore />} />
            <Route path="/virtual-tour" element={<VirtualTour />} />
            <Route path="/services" element={<Services />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

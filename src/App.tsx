
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

// Create a client
const queryClient = new QueryClient();

function App() {
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(
    localStorage.getItem("isPasswordCorrect") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isPasswordCorrect", String(isPasswordCorrect));
    
    // Check for theme preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // If no saved preference, check system preference
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [isPasswordCorrect]);

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
  }, [pathname]);

  return null;
}

export default App;

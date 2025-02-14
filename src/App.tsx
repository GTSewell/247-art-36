
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Artists from "./pages/Artists";
import ArtistSubmission from "./pages/ArtistSubmission";
import WhoAreYou from "./pages/WhoAreYou";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import VirtualTour from "./pages/VirtualTour";
import GeneralStore from "./pages/GeneralStore";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artist-submission" element={<ArtistSubmission />} />
          <Route path="/whoareyou" element={<WhoAreYou />} />
          <Route path="/services" element={<Services />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
          <Route path="/store" element={<GeneralStore />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

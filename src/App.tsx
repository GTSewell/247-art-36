
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Index';
import ArtistsPage from './pages/Artists';
import ArtistSubdomain from './pages/ArtistSubdomain';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import CollectorDashboard from './pages/pwa/CollectorDashboard';
import ArtistDashboard from './pages/pwa/ArtistDashboard';
import PasswordPage from './pages/NotFound';  // Assuming we're using NotFound as a fallback for PasswordPage
import WhoAreYou from './pages/WhoAreYou';
import Services from './pages/Services';
import Store from './pages/GeneralStore';
import VirtualTour from './pages/VirtualTour';
import { PasswordProtectionProvider } from './contexts/PasswordProtectionContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from "@/components/ui/sonner"
import AccountPage from './pages/pwa/AccountPage';
import Messages247 from './pages/Messages247';

function App() {
  return (
    <PasswordProtectionProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artist/:artistId" element={<ArtistSubdomain />} />
            <Route path="/who-are-you" element={<WhoAreYou />} />
            <Route path="/services" element={<Services />} />
            <Route path="/store" element={<Store />} />
            <Route path="/virtual-tour" element={<VirtualTour />} />
            <Route path="/password" element={<PasswordPage />} />
            <Route path="/account" element={<AccountPage />} />

            {/* User Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/messages247" element={<Messages247 />} />
            <Route path="/dashboard/collector" element={<CollectorDashboard />} />
            <Route path="/dashboard/artist" element={<ArtistDashboard />} />
          </Routes>
          <Toaster />
        </Router>
      </CartProvider>
    </PasswordProtectionProvider>
  );
}

export default App;

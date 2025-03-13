
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { SitePassword } from './components/SitePassword'
import { Toaster } from './components/ui/sonner'
import Index from './pages/Index'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import VirtualTour from './pages/VirtualTour'
import Services from './pages/Services'
import Details from './pages/Details'
import ArtistSubmission from './pages/ArtistSubmission'
import Artists from './pages/Artists'
import WhoAreYou from './pages/WhoAreYou'
import ArtistSubdomain from './pages/ArtistSubdomain'
import AccountPage from './pages/pwa/AccountPage'
import PWAHome from './pages/pwa/PWAHome'
import PWAArtists from './pages/pwa/PWAArtists'
import PWAStore from './pages/pwa/PWAStore'
import ArtistDashboard from './pages/pwa/ArtistDashboard'
import CollectorDashboard from './pages/pwa/CollectorDashboard'
import GeneralStore from './pages/GeneralStore'
import { supabase } from '@/integrations/supabase/client'
import './App.css'

const App = () => {
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const location = useLocation();

  // Check if password is already verified in localStorage and if user is authenticated
  useEffect(() => {
    const checkAuthAndPassword = async () => {
      setIsCheckingAuth(true);
      
      // Check stored password state
      const storedPasswordState = localStorage.getItem("isPasswordCorrect");
      
      if (storedPasswordState === "true") {
        setIsPasswordCorrect(true);
        
        // If password is correct, ensure user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session but password is correct, try to sign in as demo
          try {
            await supabase.auth.signInWithPassword({
              email: 'demo@247.art',
              password: 'demo247account'
            });
            console.log('Auto-signed in as demo user on app load');
          } catch (error) {
            console.error('Error auto-signing in:', error);
          }
        }
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAuthAndPassword();
  }, []);

  // If the current path is /auth/callback, skip password check
  const isAuthCallback = location.pathname.startsWith('/auth/callback');

  if (isCheckingAuth) {
    // Show loading state while checking authentication
    return <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
    </div>;
  }

  if (!isPasswordCorrect && !isAuthCallback) {
    return <SitePassword setIsPasswordCorrect={setIsPasswordCorrect} />;
  }

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<Navigate to="/account" replace />} />
        <Route path="/virtual-tour" element={<VirtualTour />} />
        <Route path="/services" element={<Services />} />
        <Route path="/details" element={<Details />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artist-submission" element={<ArtistSubmission />} />
        <Route path="/artist/:subdomainId" element={<ArtistSubdomain />} />
        <Route path="/who-are-you" element={<WhoAreYou />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/pwa" element={<PWAHome />} />
        <Route path="/pwa/artists" element={<PWAArtists />} />
        <Route path="/pwa/store" element={<PWAStore />} />
        <Route path="/pwa/artist-dashboard" element={<ArtistDashboard />} />
        <Route path="/pwa/collector-dashboard" element={<CollectorDashboard />} />
        <Route path="/store" element={<GeneralStore />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;

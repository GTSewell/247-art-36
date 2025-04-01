
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/navigation/Navigation";
import { logger } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the 404 error with enhanced information
    logger.error(
      `404 Error: User attempted to access non-existent route: ${location.pathname}`,
      { 
        path: location.pathname, 
        search: location.search,
        hostname: window.location.hostname,
        referrer: document.referrer || 'none',
        userAgent: navigator.userAgent
      }
    );
  }, [location.pathname, location.search]);

  // Detect if we're on a subdomain
  const isSubdomain = (): boolean => {
    const hostname = window.location.hostname;
    // Special handling for localhost during development
    if (hostname === 'localhost') return false;
    
    // Check if it's a direct IP address
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)) return false;
    
    // Check for known dev domains
    if (hostname.includes('vercel.app') || 
        hostname.includes('lovableproject.com')) {
      return false;
    }
    
    // Count dots to determine if it's a subdomain (e.g., artist.247.art has 2 dots)
    const parts = hostname.split('.');
    
    // For domains like artist.247.art or artist.app.local, consider them subdomains
    return parts.length > 2;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex items-center justify-center bg-gray-100 pt-16 min-h-screen">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            The page at <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> could not be found.
          </p>
          
          {isSubdomain() && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                It looks like you're visiting an artist subdomain. 
                The artist you're looking for might not exist or hasn't set up their profile yet.
              </p>
            </div>
          )}
          
          <Link to="/">
            <Button className="flex items-center gap-2">
              <Home size={18} />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

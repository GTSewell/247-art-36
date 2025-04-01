
import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { logger } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  // Check if the current URL appears to be a subdomain pattern request
  const isSubdomainRequest = useMemo(() => {
    // Extract the path without leading slash
    const path = location.pathname.replace(/^\//, '');
    
    // Check if this is an artists path with a subdomain format request
    return location.pathname.startsWith('/artists/') && 
           path.split('/').length > 1 && 
           !path.includes(' ');
  }, [location.pathname]);

  useEffect(() => {
    logger.error(
      `404 Error: User attempted to access non-existent route: ${location.pathname}`,
      { path: location.pathname, search: location.search }
    );
  }, [location.pathname, location.search]);

  if (isSubdomainRequest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zap-yellow p-4 text-center">
        <div className="w-24 h-24 mb-8">
          <img 
            src="/icons/icon-192x192.png" 
            alt="247.art logo" 
            className="w-full"
          />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">You're a little early.</h1>
        <p className="text-xl mb-8">But stay tuned for the launch!</p>
        
        <Button asChild size="lg" variant="outline" className="bg-white hover:bg-gray-100 border-black">
          <Link to="/">Go to 247.art</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            The page at <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> could not be found.
          </p>
          <Link to="/">
            <Button className="flex items-center gap-2">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

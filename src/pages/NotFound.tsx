
import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { logger } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  // Check if the current URL appears to be a subdomain pattern request
  const isSubdomainRequest = useMemo(() => {
    // Check if we're on a subdomain (not www or the main domain)
    const hostname = window.location.hostname;
    const isDomainWithSubdomain = hostname && 
                                hostname.includes('.247.art') && 
                                !hostname.startsWith('www.') && 
                                hostname !== '247.art';
    
    // Log detailed info for debugging
    logger.info('NotFound page detection', { 
      hostname,
      pathname: location.pathname,
      isDomainWithSubdomain,
      fullUrl: window.location.href
    });
    
    return isDomainWithSubdomain;
  }, [location.pathname]);

  useEffect(() => {
    if (isSubdomainRequest) {
      logger.info(`Subdomain page access detected`, { 
        hostname: window.location.hostname,
        path: location.pathname
      });
    } else {
      logger.error(
        `404 Error: User attempted to access non-existent route: ${location.pathname}`,
        { 
          path: location.pathname, 
          search: location.search, 
          hostname: window.location.hostname
        }
      );
    }
  }, [location.pathname, location.search, isSubdomainRequest]);

  // If we detect this is a subdomain request, show the custom message
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
          <Link to="https://247.art">Go to 247.art</Link>
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


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
    logger.error(
      `404 Error: User attempted to access non-existent route: ${location.pathname}`,
      { path: location.pathname, search: location.search }
    );
  }, [location.pathname, location.search]);

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


import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const navItems = [
    { name: "Artists", path: "/artists" },
    { name: "Galleries", path: "/galleries" },
    { name: "Services", path: "/services" },
  ];

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-[#f7cf1e] opacity-0">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/1012b9a0-07f9-4f8d-9297-417bb4f99733.png"
            alt="ZAP!"
            className="h-8"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 hover:text-zap-blue transition-colors duration-200 font-medium"
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="ml-4"
            >
              Log Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button className="ml-4 bg-zap-red hover:bg-zap-blue">
                Sign In
              </Button>
            </Link>
          )}
          <img
            src={isHovered ? "/lovable-uploads/eb2c14e8-c113-4c23-ad33-76d46f95badd.png" : "/lovable-uploads/ba2acde7-f602-4a0e-b52f-f5b1b5a3689e.png"}
            alt="Connect"
            className="h-8 cursor-pointer hover:opacity-90 transition-all duration-200 transform hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-zap-blue"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-[#f7cf1e] opacity-0 md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 text-gray-700 hover:text-zap-blue"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full mt-2"
                >
                  Log Out
                </Button>
              ) : (
                <Link to="/auth" className="block">
                  <Button 
                    className="w-full mt-2 bg-zap-red hover:bg-zap-blue"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
              <div className="px-3 py-2">
                <img
                  src={isHovered ? "/lovable-uploads/eb2c14e8-c113-4c23-ad33-76d46f95badd.png" : "/lovable-uploads/ba2acde7-f602-4a0e-b52f-f5b1b5a3689e.png"}
                  alt="Connect"
                  className="h-8 cursor-pointer hover:opacity-90 transition-all duration-200"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

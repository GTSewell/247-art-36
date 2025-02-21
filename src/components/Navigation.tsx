
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AuthModal from "./AuthModal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isWhoAreYou = location.pathname === '/whoareyou';

  const navItems = [
    { name: "The Details", path: "/details" },
    { name: "The Superheroes of Art", path: "/artists" },
    { name: "Who the f#@k are you?", path: "/whoareyou" },
    { name: "The General Store", path: "/store" },
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
    <>
      <nav className="fixed w-full top-0 z-50 bg-transparent">
        <div className="flex justify-between items-center p-4">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/d8aafbad-7e01-4cec-9fba-67f66a7e7952.png"
              alt="247/ART"
              className="h-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-gray-700 transition-colors duration-200 font-medium ${
                  isWhoAreYou ? 'hover:text-zap-yellow' : 'hover:text-zap-blue'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className={`ml-4 ${
                  isWhoAreYou ? 'hover:bg-zap-yellow hover:text-black' : ''
                }`}
              >
                Log Out
              </Button>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className={`ml-4 bg-zap-red ${
                  isWhoAreYou ? 'hover:bg-zap-yellow hover:text-black' : 'hover:bg-zap-blue'
                }`}
              >
                Sign In
              </Button>
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
              className={`text-gray-700 ${
                isWhoAreYou ? 'hover:text-zap-yellow' : 'hover:text-zap-blue'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-zap-yellow md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 text-gray-700 ${
                      isWhoAreYou ? 'hover:text-zap-yellow' : 'hover:text-zap-blue'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className={`w-full mt-2 ${
                      isWhoAreYou ? 'hover:bg-zap-yellow hover:text-black' : ''
                    }`}
                  >
                    Log Out
                  </Button>
                ) : (
                  <Button 
                    className={`w-full mt-2 bg-zap-red ${
                      isWhoAreYou ? 'hover:bg-zap-yellow hover:text-black' : 'hover:bg-zap-blue'
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setShowAuthModal(true);
                    }}
                  >
                    Sign In
                  </Button>
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
      
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </>
  );
};

export default Navigation;

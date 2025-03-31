import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, Menu, Home, Users, Palette, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAppMode } from "@/contexts/AppModeContext";

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  onClick,
  className,
  children,
}) => (
  <Link to={to} onClick={onClick} className={className}>
    {children}
  </Link>
);

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isPWA } = useAppMode();

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="flex lg:hidden">
      <Button
        variant="ghost"
        className="text-white"
        onClick={openMenu}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 ${isOpen ? "block" : "hidden"}`}
      >
        <div className="fixed inset-y-0 left-0 right-1/3 z-50 bg-black p-6 shadow-2xl transition-transform ease-in-out duration-300 w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <img
              src="/lovable-uploads/15e8cb31-73b1-4d72-9d9b-0dac8bf0baed.png"
              alt="247.ART Logo"
              className="h-10"
            />
            <Button
              variant="ghost"
              className="px-2 text-white"
              onClick={closeMenu}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-1">
            <MobileNavLink
              to="/"
              onClick={closeMenu}
              className="flex items-center py-2"
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/artists"
              onClick={closeMenu}
              className="flex items-center py-2"
            >
              <Users className="mr-2 h-5 w-5" />
              Artists
            </MobileNavLink>
            <MobileNavLink
              to="/atlas"
              onClick={closeMenu}
              className="flex items-center py-2"
            >
              <Palette className="mr-2 h-5 w-5" />
              ATLAS
            </MobileNavLink>
            
            <MobileNavLink
              to="/store"
              onClick={closeMenu}
              className="flex items-center py-2"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Store
            </MobileNavLink>
            
            <MobileNavLink
              to="/shop"
              onClick={closeMenu}
              className="flex items-center py-2"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Shop
            </MobileNavLink>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-2 text-white hover:bg-gray-900 rounded-md"
                >
                  <span>My Profile</span>
                </Link>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center py-2 text-white hover:bg-gray-900 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex items-center justify-center py-2 text-white hover:bg-gray-900 rounded-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;

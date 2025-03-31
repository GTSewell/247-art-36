
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Menu, Home, Users, Palette, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAppMode } from "@/contexts/AppModeContext";
import MobileNavLink from "./MobileNavLink";

interface MobileNavProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  user: any | null;
  isLoading: boolean;
}

const MobileNav = ({ isOpen, isActive, user, isLoading }: MobileNavProps) => {
  const { logout } = useAuth();
  const { isPWA } = useAppMode();
  const [showMenu, setShowMenu] = useState(isOpen);

  // Update internal state when prop changes
  useEffect(() => {
    setShowMenu(isOpen);
  }, [isOpen]);

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 ${showMenu ? "block" : "hidden"} md:hidden`}
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
            isActive={isActive("/")}
          >
            <div className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Home
            </div>
          </MobileNavLink>
          <MobileNavLink
            to="/artists"
            isActive={isActive("/artists")}
          >
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Artists
            </div>
          </MobileNavLink>
          <MobileNavLink
            to="/atlas"
            isActive={isActive("/atlas")}
          >
            <div className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              ATLAS
            </div>
          </MobileNavLink>
          
          <MobileNavLink
            to="/store"
            isActive={isActive("/store")}
          >
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Store
            </div>
          </MobileNavLink>
          
          <MobileNavLink
            to="/shop"
            isActive={isActive("/shop")}
          >
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Shop
            </div>
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
  );
};

export default MobileNav;

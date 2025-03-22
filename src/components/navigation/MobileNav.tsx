
import React from "react";
import MobileNavLink from "./MobileNavLink";
import MobileUserMenu from "./MobileUserMenu";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  user: any | null;
  isLoading: boolean;
}

const MobileNav = ({ isOpen, isActive, user, isLoading }: MobileNavProps) => {
  const location = useLocation();
  const isWhoAreYouPage = location.pathname === "/who-are-you";
  
  if (!isOpen) return null;

  return (
    <div className={`md:hidden bg-white border-t border-border/20 w-full ${isWhoAreYouPage ? 'mt-4' : ''}`}>
      <div className="max-w-full mx-auto px-6 py-2 space-y-1">
        <MobileNavLink to="/artists" isActive={isActive("/artists")}>
          Artists
        </MobileNavLink>
        <MobileNavLink to="/store" isActive={isActive("/store")}>
          Store
        </MobileNavLink>
        <MobileNavLink to="/who-are-you" isActive={isActive("/who-are-you")}>
          About Us
        </MobileNavLink>
        <MobileNavLink to="/details" isActive={isActive("/details")}>
          Pricing
        </MobileNavLink>
        
        {/* User menu with account functions */}
        <MobileUserMenu user={user} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MobileNav;

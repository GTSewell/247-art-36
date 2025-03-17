
import React from "react";
import MobileNavLink from "./MobileNavLink";
import MobileUserMenu from "./MobileUserMenu";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
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
  const { itemCount } = useCart();
  
  if (!isOpen) return null;

  return (
    <div className={`md:hidden bg-white border-t border-border/20 w-full ${isWhoAreYouPage ? 'mt-4' : ''}`}>
      <div className="max-w-full mx-auto px-6 py-2 space-y-1">
        <MobileNavLink to="/artists" isActive={isActive("/artists")}>
          Artists
        </MobileNavLink>
        <MobileNavLink to="/who-are-you" isActive={isActive("/who-are-you")}>
          About Us
        </MobileNavLink>
        <MobileNavLink to="/details" isActive={isActive("/details")}>
          Details
        </MobileNavLink>
        <MobileNavLink to="/services" isActive={isActive("/services")}>
          Services
        </MobileNavLink>
        <MobileNavLink to="/store" isActive={isActive("/store")}>
          Store
        </MobileNavLink>
        <MobileNavLink to="/virtual-tour" isActive={isActive("/virtual-tour")}>
          Virtual Tour
        </MobileNavLink>
        
        {/* Cart Link */}
        <Link
          to="/cart"
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-md text-base font-medium",
            isActive("/cart")
              ? "bg-zap-yellow text-black"
              : "bg-gray-200 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          )}
        >
          <span>Cart</span>
          {itemCount > 0 && (
            <Badge className="bg-zap-red text-white">
              {itemCount}
            </Badge>
          )}
        </Link>
        
        <MobileUserMenu user={user} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MobileNav;

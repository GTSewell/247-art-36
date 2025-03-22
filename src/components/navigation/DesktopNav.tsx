
import React from "react";
import NavLink from "./NavLink";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";

interface DesktopNavProps {
  isActive: (path: string) => boolean;
  user: any | null;
  isLoading: boolean;
}

const DesktopNav = ({ isActive, user, isLoading }: DesktopNavProps) => {
  const { itemCount } = useCart();
  const location = useLocation();
  
  // Check if we're on the cart page which has a dark background
  const isCartPage = location.pathname === "/cart";
  
  return (
    <div className="hidden md:flex items-center space-x-4 w-full justify-end">
      <NavLink to="/artists" isActive={isActive("/artists")}>
        Artists
      </NavLink>
      <NavLink to="/who-are-you" isActive={isActive("/who-are-you")}>
        About Us
      </NavLink>
      <NavLink to="/details" isActive={isActive("/details")}>
        Details
      </NavLink>
      <NavLink to="/services" isActive={isActive("/services")}>
        Services
      </NavLink>
      <NavLink to="/store" isActive={isActive("/store")}>
        Store
      </NavLink>
      
      {/* Cart Icon with proper contrast based on current page */}
      <Link to="/cart" className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`p-0 hover:bg-accent/20 ${isCartPage ? "text-white" : "text-foreground"}`}
          title="Shopping Cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-zap-red text-white rounded-full"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </Link>
      
      <UserMenu isCartPage={isCartPage} />
    </div>
  );
};

export default DesktopNav;

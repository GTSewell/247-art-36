import React from "react";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
interface DesktopNavProps {
  isActive: (path: string) => boolean;
  user: any | null;
  isLoading: boolean;
}
const DesktopNav = ({
  isActive,
  user,
  isLoading
}: DesktopNavProps) => {
  const {
    itemCount
  } = useCart();
  const location = useLocation();
  const {
    user: authUser
  } = useAuth();
  const isCartPage = location.pathname === "/cart";
  const isArtistDashboard = location.pathname.includes("/dashboard/artist");
  return <div className="hidden lg:flex lg:flex-1 lg:items-center justify-between">
      {/* Logo - Left side */}
      <div className="flex items-center">
        <Link to="/" className="mr-4">
          
        </Link>
      </div>
      
      {/* Navigation Links - Right side */}
      <div className="flex items-center gap-4">
        <NavLink to="/artists" isActive={isActive("/artists")}>
          Artists
        </NavLink>
        <NavLink to="/store" isActive={isActive("/store")}>
          Store
        </NavLink>
        <NavLink to="/who-are-you" isActive={isActive("/who-are-you")}>
          About Us
        </NavLink>
        <NavLink to="/details" isActive={isActive("/details")}>
          Sign Up
        </NavLink>
        
        <NavLink to="/shop" isActive={isActive("/shop")}>
          <ShoppingCart className="mr-2 h-4 w-4 inline" />
          Shop
        </NavLink>
        
        <Link to="/cart" className="relative ml-2">
          <Button variant="secondary" size="icon" className="p-0 rounded-md" title="Shopping Cart">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-zap-red text-white rounded-full">
                {itemCount}
              </Badge>}
          </Button>
        </Link>
        
        <UserMenu isCartPage={isCartPage} isArtistDashboard={isArtistDashboard} />
      </div>
    </div>;
};
export default DesktopNav;

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

const DesktopNav = ({ isActive, user, isLoading }: DesktopNavProps) => {
  const { itemCount } = useCart();
  const location = useLocation();
  const { user: authUser } = useAuth();
  
  // Check if we're on the cart page or artist dashboard
  const isCartPage = location.pathname === "/cart";
  const isArtistDashboard = location.pathname.includes("/dashboard/artist");
  
  return (
    <div className="hidden md:flex items-center space-x-4 w-full justify-end">
      <UserMenu isCartPage={isCartPage} isArtistDashboard={isArtistDashboard} />
    </div>
  );
};

export default DesktopNav;

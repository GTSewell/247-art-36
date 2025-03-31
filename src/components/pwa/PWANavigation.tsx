import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useShopifyCart } from '@/contexts/ShopifyCartContext';
import { Link } from 'react-router-dom';

const PWANavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { itemCount } = useShopifyCart();
  
  let displayName = 'Sign In';
  let initials = 'U';
  
  if (user) {
    if (user.email?.includes('demo') || user.email?.includes('247art')) {
      displayName = 'Demo Artist';
      initials = 'DA';
    } else {
      displayName = user.user_metadata?.full_name || '';
      
      if (!displayName || displayName.includes('@')) {
        displayName = user.email ? user.email.split('@')[0] : 'User';
      }
      
      const nameParts = displayName.split(' ');
      if (nameParts.length > 1) {
        initials = `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      } else {
        initials = displayName.charAt(0);
      }
    }
  }

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-1/4 h-full ${
                isActive ? 'text-zap-yellow' : 'text-gray-400'
              }`
            }
          >
            <Home className="h-6 w-6" color={window.location.pathname === '/' ? '#f7cf1e' : '#9ca3af'} />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          
          <NavLink 
            to="/artists" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-1/4 h-full ${
                isActive ? 'text-zap-blue' : 'text-gray-400'
              }`
            }
          >
            <Users className="h-6 w-6" color={window.location.pathname === '/artists' ? '#00baef' : '#9ca3af'} />
            <span className="text-xs mt-1">Artists</span>
          </NavLink>
          
          <NavLink 
            to="/store" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-1/4 h-full ${
                isActive ? 'text-zap-red' : 'text-gray-400'
              }`
            }
          >
            <ShoppingBag className="h-6 w-6" color={window.location.pathname === '/store' ? '#ef3f36' : '#9ca3af'} />
            <span className="text-xs mt-1">Store</span>
          </NavLink>
          
          <Link to="/shop" className="flex flex-col items-center justify-center">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-zap-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">Shop</span>
          </Link>
          
          <NavLink 
            to="/account" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-1/4 h-full relative ${
                isActive ? 'text-zap-yellow' : 'text-gray-400'
              }`
            }
            onClick={handleAccountClick}
          >
            <div className="relative">
              <div className="bg-gray-800 rounded-full p-1">
                <Avatar className="h-10 w-10 border border-white/30">
                  <AvatarImage 
                    src="/lovable-uploads/af63a2ba-f2fc-4794-af1b-a504b0c294de.png" 
                    alt="Account" 
                  />
                  <AvatarFallback className="bg-gray-600 text-white">
                    {user?.email?.substring(0, 2).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </div>
              {itemCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-zap-red text-white h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{displayName}</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default PWANavigation;

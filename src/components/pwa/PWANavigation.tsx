
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, ShoppingBag } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PWANavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const displayName = user?.user_metadata?.full_name || 
                     (user?.email ? user.email.split('@')[0] : '');

  // Handle account navigation based on authentication status
  const handleAccountClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  return (
    <>
      {/* Top transparent header - Reduced height */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-black bg-opacity-0 pwa-header h-1"></header>
      
      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black text-white shadow-lg z-50 pwa-footer h-16">
        <div className="flex justify-around items-center h-full px-2">
          {/* Home icon - zap yellow */}
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
          
          {/* Artists icon - zap blue */}
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
          
          {/* Store icon - zap red */}
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
          
          {/* Account icon - with cart badge overlay */}
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
              <Avatar className="h-10 w-10 border border-white/30 bg-gray-800">
                <AvatarImage 
                  src="/lovable-uploads/2b4962e8-7f5b-46d0-8cb9-b263bb3f3aad.png" 
                  alt="Account" 
                />
                <AvatarFallback className="bg-gray-600 text-white">
                  {user?.email?.substring(0, 2).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              {itemCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-zap-red text-white h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1">{user ? displayName || 'Account' : 'Sign in'}</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default PWANavigation;

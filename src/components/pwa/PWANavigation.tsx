
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, ShoppingBag, User } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";

const PWANavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
          {/* Home icon */}
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-1/4 h-full ${
                isActive ? 'text-zap-red' : 'text-gray-400'
              }`
            }
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          
          {/* Artists icon */}
          <NavLink 
            to="/artists" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-1/4 h-full ${
                isActive ? 'text-zap-yellow' : 'text-gray-400'
              }`
            }
          >
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Artists</span>
          </NavLink>
          
          {/* Store icon */}
          <NavLink 
            to="/store" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-1/4 h-full ${
                isActive ? 'text-zap-yellow' : 'text-gray-400'
              }`
            }
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs mt-1">Store</span>
          </NavLink>
          
          {/* Account icon */}
          <NavLink 
            to="/account" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-1/4 h-full ${
                isActive ? 'text-zap-yellow' : 'text-gray-400'
              }`
            }
            onClick={handleAccountClick}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Account</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default PWANavigation;

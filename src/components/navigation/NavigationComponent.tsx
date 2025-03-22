import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAppMode } from '@/contexts/AppModeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Home, Users, ShoppingBag } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { MobileUserMenu } from './MobileUserMenu';
import AuthModal from '@/components/AuthModal';
import { useCart } from '@/contexts/CartContext';
import { Badge } from "@/components/ui/badge";

const NavigationComponent = () => {
  const { user, isLoading } = useAuth();
  const { isPWA } = useAppMode();
  const isMobile = useIsMobile();
  const { itemCount } = useCart();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  // Determine if we should use mobile-friendly UI
  const useMobileUI = isPWA || isMobile;

  const handleAuthModalOpen = () => {
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  return (
    <>
      {/* PWA-specific navigation (bottom navbar) */}
      {isPWA && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black text-white shadow-lg z-50 pwa-footer h-16">
          <div className="flex justify-around items-center h-full px-2">
            {/* Home icon - zap yellow */}
            <Link
              to="/"
              className="flex flex-col items-center justify-center w-1/4 h-full"
            >
              <Home className="h-6 w-6" color={window.location.pathname === '/' ? '#f7cf1e' : '#9ca3af'} />
              <span className="text-xs mt-1">Home</span>
            </Link>

            {/* Artists icon - zap blue */}
            <Link
              to="/artists"
              className="flex flex-col items-center justify-center w-1/4 h-full"
            >
              <Users className="h-6 w-6" color={window.location.pathname === '/artists' ? '#00baef' : '#9ca3af'} />
              <span className="text-xs mt-1">Artists</span>
            </Link>

            {/* Store icon - zap red */}
            <Link
              to="/store"
              className="flex flex-col items-center justify-center w-1/4 h-full"
            >
              <ShoppingBag className="h-6 w-6" color={window.location.pathname === '/store' ? '#ef3f36' : '#9ca3af'} />
              <span className="text-xs mt-1">Store</span>
            </Link>

            {/* Account icon - with cart badge overlay */}
            <Link
              to="/account"
              className="flex flex-col items-center justify-center w-1/4 h-full relative"
            >
              <div className="relative">
                <div className="h-10 w-10 border border-white/30 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">{user?.email?.substring(0, 2).toUpperCase() || 'A'}</span>
                </div>
                {itemCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 bg-zap-red text-white h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{user ? 'Account' : 'Log in'}</span>
            </Link>
          </div>
        </nav>
      )}

      {/* Non-PWA navigation (top header) */}
      {!isPWA && (
        <header className="bg-white dark:bg-gray-900 shadow-md z-50 fixed top-0 left-0 right-0">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-black dark:text-white">
              247/ART
            </Link>

            {/* Navigation links for larger screens */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/artists" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Artists
              </Link>
              <Link to="/store" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Store
              </Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                About
              </Link>
            </nav>

            {/* User authentication and menu */}
            <div className="flex items-center space-x-4">
              {useMobileUI ? (
                // Mobile user menu
                <MobileUserMenu user={user} isLoading={isLoading} />
              ) : (
                // Desktop user menu
                <UserMenu />
              )}
            </div>
          </div>
        </header>
      )}

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={handleAuthModalClose} />
    </>
  );
};

export default NavigationComponent;

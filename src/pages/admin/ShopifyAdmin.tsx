import React from 'react';
import ShopifyIntegration from '@/components/admin/ShopifyIntegration';
import UserMenu from '@/components/navigation/UserMenu';
import ErrorBoundary from '@/components/admin/ErrorBoundary';

const ShopifyAdmin = () => {
  console.log("ShopifyAdmin: Component rendering");
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">Shopify Admin</h1>
            <UserMenu />
          </div>
        </header>
        <div className="container mx-auto p-4 sm:p-6">
          <ErrorBoundary>
            <ShopifyIntegration />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ShopifyAdmin;
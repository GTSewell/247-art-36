import React from 'react';
import ShopifyIntegration from '@/components/admin/ShopifyIntegration';
import UserMenu from '@/components/navigation/UserMenu';

const ShopifyAdmin = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shopify Admin</h1>
          <UserMenu />
        </div>
      </header>
      <div className="container mx-auto p-6">
        <ShopifyIntegration />
      </div>
    </div>
  );
};

export default ShopifyAdmin;
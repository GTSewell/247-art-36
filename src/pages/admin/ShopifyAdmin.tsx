import React from 'react';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import ShopifyIntegration from '@/components/admin/ShopifyIntegration';

const ShopifyAdmin = () => {
  return (
    <AdminProtectedRoute>
      <div className="container mx-auto p-6">
        <ShopifyIntegration />
      </div>
    </AdminProtectedRoute>
  );
};

export default ShopifyAdmin;
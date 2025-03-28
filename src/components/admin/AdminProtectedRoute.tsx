
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAdminAccess } from '@/utils/admin-utils';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      
      try {
        const hasAccess = await checkAdminAccess();
        setIsAdmin(hasAccess);
      } catch (error) {
        console.error("Error checking admin access:", error);
        toast.error("Failed to verify admin status");
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };
    
    if (!isLoading) {
      checkAccess();
    }
  }, [user, isLoading]);
  
  if (isLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    toast.error("You must be logged in to access admin features");
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin) {
    toast.error("You don't have admin privileges");
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;

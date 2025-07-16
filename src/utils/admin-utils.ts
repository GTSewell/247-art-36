
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user is an admin
 * Checks the user_roles table for admin role
 */
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user found");
      return false;
    }
    
    console.log("Checking admin status for user:", user.email);
    
    // Check if user has admin role in user_roles table
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');
    
    if (error) {
      console.error("Error querying user roles:", error);
      return false;
    }
    
    const isAdmin = roles && roles.length > 0;
    console.log("User is admin:", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Higher-order component to protect admin routes
 */
export const checkAdminAccess = async (): Promise<boolean> => {
  return await isUserAdmin();
};


import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user is an admin
 * Uses the is_admin() database function
 */
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user found");
      return false;
    }
    
    console.log("Checking admin status for user:", user.email);
    
    // Use the existing is_admin() database function
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error("Error calling is_admin function:", error);
      return false;
    }
    
    const isAdmin = data === true;
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

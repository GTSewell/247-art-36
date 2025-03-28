
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user is an admin
 * Currently, only the specified email is considered an admin
 */
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // For now, we'll use a hardcoded admin email
    // In the future, this could be replaced with a proper roles system
    return user.email === 'gtsewell@live.com';
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

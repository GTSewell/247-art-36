
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { signInWithDemoAccount } from '@/utils/auth-utils';

/**
 * Handles authentication after successful password validation
 */
export const handleAuthAfterPassword = async (userName: string, recipientName: string | null): Promise<boolean> => {
  try {
    // Display welcome message
    if (userName.trim()) {
      toast.success(`Welcome ${userName}!`);
    } else if (recipientName) {
      toast.success(`Welcome ${recipientName}!`);
    } else {
      toast.success('Welcome to 247.art!');
    }
    
    // Sign in with demo account
    const signedIn = await signInWithDemoAccount();
    
    if (signedIn) {
      logger.info("Demo account sign-in successful after password entry", { success: true });
    } else {
      logger.warn("Demo account sign-in failed after password entry", { success: false });
    }
    
    // Set local storage flag
    localStorage.setItem("isPasswordCorrect", "true");
    
    return signedIn;
  } catch (error: any) {
    logger.error('Error in auth handling:', { error });
    return false;
  }
};

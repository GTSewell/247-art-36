
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface LogPasswordParams {
  password: string;
  userName: string | null;
}

/**
 * Simple password access logging that only logs the password and user name
 * without tracking IP addresses or using complex fallback mechanisms
 */
export const logPasswordAccess = async ({
  password,
  userName
}: LogPasswordParams): Promise<boolean> => {
  try {
    logger.info("Logging password access to simplified logs table", {
      password_prefix: password.substring(0, 2) + '***',
      user_name: userName
    });
    
    const { error } = await supabase
      .from('password_logs')
      .insert({ 
        site_password: password,
        user_name: userName
      });
    
    if (error) {
      logger.error("Error logging password access:", { error });
      return false;
    }
    
    logger.info("Password access logged successfully to simplified logs");
    return true;
  } catch (error) {
    logger.error("Unexpected error in password logging:", { error });
    return false;
  }
};

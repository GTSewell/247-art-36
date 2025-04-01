
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

/**
 * Validates a password against the site_settings table
 */
export const validatePassword = async (normalizedPassword: string): Promise<boolean> => {
  try {
    logger.info("Validating password:", { 
      normalizedPassword: normalizedPassword.substring(0, 2) + '***' 
    });
    
    const { data, error: settingsError } = await supabase
      .from('site_settings')
      .select('recipient_name, usage_count')
      .eq('site_password', normalizedPassword)
      .single();
    
    if (settingsError) {
      logger.error("Failed to retrieve password data:", { error: settingsError });
      return false;
    }
    
    logger.info("Password validation result:", { isCorrect: !!data });
    return !!data;
  } catch (error: any) {
    logger.error('Error in password validation:', { error });
    return false;
  }
};

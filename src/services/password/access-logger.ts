
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface LogPasswordParams {
  normalizedPassword: string;
  userName: string;
}

/**
 * Simplified password access logging that focuses only on recording 
 * the password used and the user's name
 */
export const logPasswordAccess = async ({
  normalizedPassword,
  userName
}: LogPasswordParams): Promise<void> => {
  try {
    logger.info("Logging password access with the following data:", {
      password_used: normalizedPassword.substring(0, 2) + '***',
      user_name: userName.trim() || null
    });
    
    // Primary logging attempt
    const { error: logError } = await supabase
      .from('password_access_logs')
      .insert({ 
        site_password: normalizedPassword,
        ip_address: 'not-tracked', // We're no longer tracking IP addresses
        user_provided_name: userName.trim() || null
      });
    
    if (logError) {
      logger.error("Error inserting log:", { error: logError });
      
      // Use RPC fallback if available
      try {
        const { error: rpcError } = await supabase.rpc('log_password_access', {
          p_site_password: normalizedPassword,
          p_user_provided_name: userName.trim() || null
        });
        
        if (rpcError) {
          logger.error("RPC fallback logging failed:", { error: rpcError });
          
          // Final fallback with minimal info
          const { error: finalError } = await supabase
            .from('password_access_logs')
            .insert({ 
              site_password: normalizedPassword,
              ip_address: 'emergency-fallback',
              user_provided_name: userName.trim() || null
            });
            
          if (finalError) {
            logger.error("All logging attempts failed:", { error: finalError });
          } else {
            logger.info("Minimal fallback logging succeeded", { success: true });
          }
        } else {
          logger.info("RPC fallback logging succeeded", { success: true });
        }
      } catch (finalError) {
        logger.error("All logging attempts failed:", { error: finalError });
      }
    } else {
      logger.info("Password access logged successfully", { success: true });
    }
  } catch (error) {
    logger.error("Unexpected error in access logging:", { error });
    
    // Ultimate emergency fallback
    try {
      await supabase
        .from('password_access_logs')
        .insert({ 
          site_password: normalizedPassword,
          ip_address: 'critical-fallback',
          user_provided_name: userName.trim() || null
        });
    } catch (e) {
      logger.error("Critical error in logging:", { error: e });
    }
  }
};


import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { SiteSettingsRow } from '@/types/database';
import { updateUniqueIpCount } from './usage-tracker';

interface LogPasswordParams {
  normalizedPassword: string;
  ipAddress: string | null;
  settingsData: Partial<SiteSettingsRow>;
  userName: string;
}

/**
 * Logs password access to the password_access_logs table
 */
export const logPasswordAccess = async ({
  normalizedPassword,
  ipAddress,
  settingsData,
  userName
}: LogPasswordParams): Promise<void> => {
  try {
    // Use a default IP if not available - this ensures consistent logging across all browsers
    const clientIp = ipAddress || 'ip-not-recorded';
    
    logger.info("Logging password access with the following data:", {
      site_password: normalizedPassword.substring(0, 2) + '***',
      ip_address: clientIp,
      original_recipient_name: settingsData?.recipient_name || null,
      user_provided_name: userName.trim() || null
    });
    
    // Define the log data object with proper typing
    const logData = { 
      site_password: normalizedPassword,
      ip_address: clientIp, 
      original_recipient_name: settingsData?.recipient_name || null,
      user_provided_name: userName.trim() || null
    };
    
    // Main log attempt
    const { error: logError } = await supabase
      .from('password_access_logs')
      .insert(logData);
    
    if (logError) {
      logger.error("Error inserting log:", { error: logError });
      
      // First fallback: Try RPC method
      const { error: rpcError } = await supabase.rpc('log_password_access', {
        p_site_password: normalizedPassword,
        p_ip_address: clientIp,
        p_original_recipient_name: settingsData?.recipient_name || null,
        p_user_provided_name: userName.trim() || null
      });
      
      if (rpcError) {
        logger.error("RPC fallback logging also failed:", { error: rpcError });
        
        // Second fallback: Try minimal data approach
        const minimalLogData = { 
          site_password: normalizedPassword,
          ip_address: 'fallback-logging', 
          user_provided_name: userName.trim() || null
        };
        
        const { error: minimalLogError } = await supabase
          .from('password_access_logs')
          .insert(minimalLogData);
        
        if (minimalLogError) {
          logger.error("Minimal fallback logging also failed:", { error: minimalLogError });
        } else {
          logger.info("Minimal fallback logging succeeded", { success: true });
        }
      } else {
        logger.info("RPC fallback logging succeeded", { success: true });
      }
    } else {
      logger.info("Password access logged successfully", { success: true });
      
      if (clientIp !== 'ip-not-recorded') {
        await updateUniqueIpCount(normalizedPassword);
      }
    }
  } catch (logError) {
    logger.error("Error with logging:", { error: logError });
    
    // Ultimate fallback with minimal required data
    try {
      const finalFallbackData = { 
        site_password: normalizedPassword,
        ip_address: 'error-recovery-fallback', 
        user_provided_name: userName.trim() || null
      };
      
      const { error: finalFallbackError } = await supabase
        .from('password_access_logs')
        .insert(finalFallbackData);
        
      if (finalFallbackError) {
        logger.error("Final fallback logging failed:", { error: finalFallbackError });
      } else {
        logger.info("Final fallback password logging succeeded", { success: true });
      }
    } catch (finalError) {
      logger.error("All logging attempts failed:", { error: finalError });
    }
  }
};

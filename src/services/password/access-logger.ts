
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
    const clientIp = ipAddress || 'client-detection-failed';
    
    logger.info("Logging password access with the following data:", {
      site_password: normalizedPassword.substring(0, 2) + '***',
      ip_address: clientIp,
      original_recipient_name: settingsData?.recipient_name || null,
      user_provided_name: userName.trim() || null
    });
    
    const { error: logError } = await supabase
      .from('password_access_logs')
      .insert({ 
        site_password: normalizedPassword,
        ip_address: clientIp, 
        original_recipient_name: settingsData?.recipient_name || null,
        user_provided_name: userName.trim() || null
      });
    
    if (logError) {
      logger.error("Error inserting log:", { error: logError });
      
      const { error: rpcError } = await supabase.rpc('log_password_access', {
        p_site_password: normalizedPassword,
        p_ip_address: clientIp,
        p_original_recipient_name: settingsData?.recipient_name || null,
        p_user_provided_name: userName.trim() || null
      });
      
      if (rpcError) {
        logger.error("RPC fallback logging also failed:", { error: rpcError });
      } else {
        logger.info("RPC fallback logging succeeded", { success: true });
      }
    } else {
      logger.info("Password access logged successfully", { success: true });
      
      await updateUniqueIpCount(normalizedPassword);
    }
  } catch (logError) {
    logger.error("Error with IP fetch or logging:", { error: logError });
    
    const { error: fallbackLogError } = await supabase
      .from('password_access_logs')
      .insert({ 
        site_password: normalizedPassword,
        ip_address: 'client-side-fallback', 
        original_recipient_name: settingsData?.recipient_name || null,
        user_provided_name: userName.trim() || null
      });
      
    if (fallbackLogError) {
      logger.error("Error with fallback logging:", { error: fallbackLogError });
    } else {
      logger.info("Fallback password access logged successfully", { success: true });
    }
  }
};

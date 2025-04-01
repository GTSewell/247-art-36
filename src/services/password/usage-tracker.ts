
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { SiteSettingsRow } from '@/types/database';

/**
 * Updates the usage count for a password
 */
export const updateUsageCount = async (normalizedPassword: string, currentCount: number): Promise<void> => {
  try {
    const updatedCount = currentCount + 1;
    
    logger.info("Updating usage count", { 
      password: normalizedPassword.substring(0, 2) + '***', 
      newCount: updatedCount 
    });
    
    await supabase
      .from('site_settings')
      .update({ 
        usage_count: updatedCount 
      })
      .eq('site_password', normalizedPassword);
  } catch (error: any) {
    logger.error('Error updating usage count:', { error });
  }
};

/**
 * Updates the count of unique IPs that have accessed with this password
 */
export const updateUniqueIpCount = async (normalizedPassword: string): Promise<void> => {
  try {
    const { data: uniqueIpData, error: uniqueIpError } = await supabase
      .from('password_access_logs')
      .select('ip_address')
      .eq('site_password', normalizedPassword);
      
    if (!uniqueIpError && uniqueIpData) {
      const uniqueIps = new Set(uniqueIpData.map(log => log.ip_address));
      const uniqueIpCount = uniqueIps.size;
      
      await supabase
        .from('site_settings')
        .update({ unique_ip_count: uniqueIpCount })
        .eq('site_password', normalizedPassword);
        
      logger.info("Updated unique IP count for password", { 
        count: uniqueIpCount,
        passwordPrefix: normalizedPassword.substring(0, 2) + '***'
      });
    }
  } catch (error) {
    logger.error("Error updating unique IP count:", { error });
  }
};

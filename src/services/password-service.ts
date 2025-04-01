
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { SiteSettingsRow, PasswordAccessLogRow } from '@/types/database';
import { validateSitePassword, signInWithDemoAccount } from '@/utils/auth-utils';
import { toast } from 'sonner';

interface PasswordSubmitParams {
  password: string;
  userName: string;
  ipAddress: string | null;
}

interface PasswordSubmitResult {
  isCorrect: boolean;
  recipientName?: string | null;
}

export const submitPassword = async ({
  password,
  userName,
  ipAddress
}: PasswordSubmitParams): Promise<PasswordSubmitResult> => {
  try {
    const normalizedPassword = password.toLowerCase().trim();
    logger.info("Normalized password:", { 
      normalizedPassword: normalizedPassword.substring(0, 2) + '***' 
    });
    
    const isCorrect = await validateSitePassword(normalizedPassword);
    logger.info("Password validation result:", { isCorrect });
    
    if (!isCorrect) {
      logger.error("Password validation failed for:", { 
        password: normalizedPassword.substring(0, 2) + '***' 
      });
      return { isCorrect: false };
    }

    const { data: settingsData, error: settingsError } = await supabase
      .from('site_settings')
      .select('recipient_name, usage_count')
      .eq('site_password', normalizedPassword)
      .single();
    
    if (settingsError) {
      logger.error("Failed to fetch recipient data:", { error: settingsError });
      toast.error("Error retrieving user data");
      return { isCorrect: true };
    }
    
    // Update usage count
    const updatedCount = (settingsData?.usage_count || 0) + 1;
    
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
    
    // Log password access
    await logPasswordAccess({
      normalizedPassword,
      ipAddress,
      settingsData: settingsData as Partial<SiteSettingsRow>,
      userName
    });
    
    // Display welcome message
    if (userName.trim()) {
      toast.success(`Welcome ${userName}!`);
    } else if (settingsData?.recipient_name) {
      toast.success(`Welcome ${settingsData.recipient_name}!`);
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
    
    localStorage.setItem("isPasswordCorrect", "true");
    
    return { 
      isCorrect: true,
      recipientName: settingsData?.recipient_name 
    };
  } catch (error: any) {
    logger.error('Error checking password:', { error });
    toast.error(`Error: ${error.message || 'Failed to validate password'}`);
    return { isCorrect: false };
  }
};

interface LogPasswordParams {
  normalizedPassword: string;
  ipAddress: string | null;
  settingsData: Partial<SiteSettingsRow>;
  userName: string;
}

const logPasswordAccess = async ({
  normalizedPassword,
  ipAddress,
  settingsData,
  userName
}: LogPasswordParams) => {
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

const updateUniqueIpCount = async (normalizedPassword: string) => {
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


import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { toast } from "sonner";
import { signInWithDemoAccount } from "@/utils/auth-utils";

export interface PasswordValidationParams {
  password: string;
  recipientName: string;
  clientIp: string;
}

export interface ValidationResult {
  isValid: boolean;
  currentRecipientName: string | null;
}

export const validatePassword = async ({
  password,
  recipientName,
  clientIp
}: PasswordValidationParams): Promise<ValidationResult> => {
  try {
    const lowerPassword = password.toLowerCase().trim();
    logger.info('Attempting login with password:', { password: lowerPassword });

    // Validate against database
    const { data, error } = await supabase
      .from('site_settings')
      .select('site_password, recipient_name')
      .eq('site_password', lowerPassword)
      .single();
      
    if (error || !data) {
      logger.info('Invalid password attempt', { success: false });
      return { isValid: false, currentRecipientName: null };
    }
    
    logger.info('Valid password found, proceeding with authentication', { success: true });
    
    // Get current recipient name
    const currentRecipientName = data.recipient_name || null;
    
    // If recipient name is provided, update it in the database
    if (recipientName.trim()) {
      try {
        await supabase
          .from('site_settings')
          .update({ 
            recipient_name: recipientName.trim()
          })
          .eq('site_password', lowerPassword);
        
        logger.info("Recipient name updated for password:", { password: lowerPassword });
      } catch (updateError) {
        logger.error("Failed to update recipient name:", { error: updateError });
      }
      
      // Log access with original and new recipient name
      await logPasswordAccess(lowerPassword, clientIp, currentRecipientName, recipientName.trim());
    }
    
    return { isValid: true, currentRecipientName };
    
  } catch (error) {
    logger.error('Password check error:', { error });
    return { isValid: false, currentRecipientName: null };
  }
};

export const signInWithDemo = async (): Promise<boolean> => {
  // Try to sign in with demo account
  const signedIn = await signInWithDemoAccount();
  
  if (signedIn) {
    logger.info('Auto-signed in with demo account', { success: true });
    return true;
  } else {
    logger.warn('Could not auto-sign in with demo account', { success: false });
    return false;
  }
};

const logPasswordAccess = async (
  password: string, 
  clientIp: string, 
  originalRecipientName: string | null, 
  userProvidedName: string
) => {
  try {
    // Log access
    const { error: logError } = await supabase
      .from('password_access_logs')
      .insert({ 
        site_password: password,
        ip_address: clientIp, 
        original_recipient_name: originalRecipientName,
        user_provided_name: userProvidedName
      });
      
    if (logError) {
      logger.error("Error logging password access:", { error: logError });
    } else {
      logger.info("Password access logged successfully", { success: true });
      
      // Update the unique_ip_count in site_settings
      await updateUniqueIpCount(password);
    }
  } catch (logError) {
    logger.error("Error with access logging:", { error: logError });
    
    // Fallback logging without IP
    const { error: fallbackLogError } = await supabase
      .from('password_access_logs')
      .insert({ 
        site_password: password,
        ip_address: 'client-side-fallback', 
        original_recipient_name: originalRecipientName,
        user_provided_name: userProvidedName
      });
      
    if (fallbackLogError) {
      logger.error("Error with fallback logging:", { error: fallbackLogError });
    }
  }
};

const updateUniqueIpCount = async (password: string) => {
  try {
    // Calculate the current unique IP count
    const { data: uniqueIpData, error: uniqueIpError } = await supabase
      .from('password_access_logs')
      .select('ip_address')
      .eq('site_password', password);
      
    if (!uniqueIpError && uniqueIpData) {
      // Get unique IPs using Set
      const uniqueIps = new Set(uniqueIpData.map(log => log.ip_address));
      const uniqueIpCount = uniqueIps.size;
      
      // Update the site_settings table with the new count
      await supabase
        .from('site_settings')
        .update({ unique_ip_count: uniqueIpCount })
        .eq('site_password', password);
        
      logger.info(`Updated unique IP count to ${uniqueIpCount}`, { count: uniqueIpCount });
    }
  } catch (error) {
    logger.error("Error updating unique IP count:", { error });
  }
};

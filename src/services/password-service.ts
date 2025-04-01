
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { SiteSettingsRow } from '@/types/database';
import { validateSitePassword } from '@/utils/auth-utils';
import { toast } from 'sonner';
import { validatePassword } from './password/password-validator';
import { updateUsageCount } from './password/usage-tracker';
import { logPasswordAccess } from './password/access-logger';
import { handleAuthAfterPassword } from './password/auth-handler';

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
    await updateUsageCount(normalizedPassword, settingsData?.usage_count || 0);
    
    // Log password access
    await logPasswordAccess({
      normalizedPassword,
      ipAddress,
      settingsData: settingsData as Partial<SiteSettingsRow>,
      userName
    });
    
    // Handle authentication
    await handleAuthAfterPassword(userName, settingsData?.recipient_name);
    
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

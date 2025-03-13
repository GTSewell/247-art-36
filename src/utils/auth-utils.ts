
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Validates a site password against the database
 * @param password - The password to validate
 * @returns A promise that resolves to true if the password is valid, false otherwise
 */
export const validateSitePassword = async (password: string): Promise<boolean> => {
  try {
    console.log("Validating password:", password);
    
    // Get all site passwords
    const { data, error } = await supabase
      .from('site_settings')
      .select('site_password')
      .eq('site_password', password.toLowerCase().trim());
    
    if (error) throw error;
    
    // Check if entered password matches any of the passwords in the database
    const isCorrect = data && data.length > 0;
    
    console.log("Password validation result:", isCorrect);
    
    if (isCorrect) {
      // After successful validation, perform the update in the background
      supabase
        .from('site_settings')
        .update({
          created_at: new Date().toISOString()
        })
        .eq('site_password', password.toLowerCase().trim())
        .then(({ error: updateError }) => {
          if (updateError) {
            console.error('Background update error:', updateError);
          }
        });
    }
    
    return isCorrect;
  } catch (error: any) {
    console.error('Error validating password:', error);
    return false;
  }
};

/**
 * Signs in with the demo account
 * @returns A promise that resolves to true if sign-in was successful, false otherwise
 */
export const signInWithDemoAccount = async (): Promise<boolean> => {
  try {
    console.log("Attempting to sign in with demo account");
    
    // First sign out any existing session to avoid conflicts
    await supabase.auth.signOut();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo@example.com',
      password: '1234'
    });
    
    if (error) {
      console.error('Demo login error:', error);
      toast.error(`Login failed: ${error.message}`);
      return false;
    }
    
    console.log('Successfully logged in with demo account', data);
    return true;
  } catch (error: any) {
    console.error('Unexpected error during demo login:', error);
    toast.error(`Unexpected error: ${error.message}`);
    return false;
  }
};

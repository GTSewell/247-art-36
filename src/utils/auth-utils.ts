
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
    
    // Check if the demo account exists
    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
      email: 'demo@247.art',
      password: '123456'
    });
    
    if (userError) {
      console.error('Demo login error:', userError);
      
      if (userError.message.includes("Invalid login credentials")) {
        console.log("Demo account login failed due to invalid credentials");
        toast.error("Demo account login failed. Please check Supabase Authentication settings.");
        
        if (userError.message.includes("Email not confirmed")) {
          console.log("Email confirmation required for demo account");
          toast.error("Demo account email needs to be confirmed in Supabase Authentication dashboard");
        }
        
        return false;
      }
      
      toast.error(`Login error: ${userError.message}`);
      return false;
    }
    
    console.log('Successfully logged in with demo account', userData);
    toast.success("Successfully signed in with demo account");
    return true;
  } catch (error: any) {
    console.error('Unexpected error during demo login:', error);
    toast.error(`Unexpected error: ${error.message}`);
    return false;
  }
};

/**
 * Creates the demo account if it doesn't exist
 * This function should be called from an admin context or edge function
 * It will not work from the client side with the anon key
 */
export const createDemoAccountIfNeeded = async (): Promise<boolean> => {
  try {
    // This function is a placeholder and would need to be implemented
    // as an edge function with the service role key
    console.log("This function needs to be implemented as an edge function");
    return false;
  } catch (error: any) {
    console.error('Error creating demo account:', error);
    return false;
  }
};

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { validateSitePassword, signInWithDemoAccount } from '@/utils/auth-utils';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface PasswordFormProps {
  setIsPasswordCorrect: (isCorrect: boolean) => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ setIsPasswordCorrect }) => {
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  
  // Try to fetch IP address when component mounts
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        // Try main IP service
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          setIpAddress(data.ip);
          logger.info("Successfully obtained IP address from primary service", { ip: data.ip });
          return;
        }
        
        // Fallback services if the first one fails
        const fallbackServices = [
          'https://ipinfo.io/json',
          'https://api.ip.sb/jsonip',
          'https://api64.ipify.org?format=json'
        ];
        
        for (const service of fallbackServices) {
          try {
            const fallbackResponse = await fetch(service);
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              const ip = fallbackData.ip;
              setIpAddress(ip);
              logger.info(`Successfully obtained IP address from fallback service ${service}`, { ip });
              return;
            }
          } catch (innerError) {
            logger.warn(`Fallback IP service ${service} failed:`, innerError);
          }
        }
        
        // If we get here, all services failed
        logger.error("All IP address services failed");
      } catch (error) {
        logger.error("Error fetching IP address:", error);
      }
    };
    
    getIpAddress();
  }, []);
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the user name field - more strict validation now
    if (!userName.trim()) {
      setNameError('Please enter your name');
      return;
    } else {
      setNameError('');
    }
    
    setIsLoading(true);
    logger.info("Attempting to validate password:", { password: password.substring(0, 2) + '***', userName });
    
    try {
      // Normalize password - lowercase and trim whitespace
      const normalizedPassword = password.toLowerCase().trim();
      logger.info("Normalized password:", { normalizedPassword: normalizedPassword.substring(0, 2) + '***' });
      
      const isCorrect = await validateSitePassword(normalizedPassword);
      logger.info("Password validation result:", { isCorrect });
      
      if (isCorrect) {
        // Fetch recipient name from the database
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('recipient_name, usage_count')
          .eq('site_password', normalizedPassword)
          .single();
        
        if (settingsError) {
          logger.error("Failed to fetch recipient data:", settingsError);
          toast.error("Error retrieving user data");
        } else {
          // Increment usage count manually
          const updatedCount = (settingsData?.usage_count || 0) + 1;
          
          logger.info("Updating usage count", { 
            password: normalizedPassword.substring(0, 2) + '***', 
            newCount: updatedCount 
          });
          
          await supabase
            .from('site_settings')
            .update({ usage_count: updatedCount })
            .eq('site_password', normalizedPassword);
          
          // Log access with both the original recipient name and user-provided name
          try {
            // Use provided IP or fallback to client-side detection
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
              logger.error("Error inserting log:", logError);
              
              // Try direct RPC call as a last resort
              const { error: rpcError } = await supabase.rpc('log_password_access', {
                p_site_password: normalizedPassword,
                p_ip_address: clientIp,
                p_original_recipient_name: settingsData?.recipient_name || null,
                p_user_provided_name: userName.trim() || null
              });
              
              if (rpcError) {
                logger.error("RPC fallback logging also failed:", rpcError);
              } else {
                logger.info("RPC fallback logging succeeded", { success: true });
              }
            } else {
              logger.info("Password access logged successfully", { success: true });
              
              // Update the unique_ip_count in site_settings
              // Calculate the current unique IP count
              const { data: uniqueIpData, error: uniqueIpError } = await supabase
                .from('password_access_logs')
                .select('ip_address')
                .eq('site_password', normalizedPassword);
                
              if (!uniqueIpError && uniqueIpData) {
                // Get unique IPs using Set
                const uniqueIps = new Set(uniqueIpData.map(log => log.ip_address));
                const uniqueIpCount = uniqueIps.size;
                
                // Update the site_settings table with the new count
                await supabase
                  .from('site_settings')
                  .update({ unique_ip_count: uniqueIpCount })
                  .eq('site_password', normalizedPassword);
                  
                logger.info(`Updated unique IP count to ${uniqueIpCount} for password ${normalizedPassword.substring(0, 2) + '***'}`, { count: uniqueIpCount });
              }
            }
          } catch (logError) {
            logger.error("Error with IP fetch or logging:", logError);
            
            // Fallback logging without IP
            const { error: fallbackLogError } = await supabase
              .from('password_access_logs')
              .insert({ 
                site_password: normalizedPassword,
                ip_address: 'client-side-fallback', 
                original_recipient_name: settingsData?.recipient_name || null,
                user_provided_name: userName.trim() || null
              });
              
            if (fallbackLogError) {
              logger.error("Error with fallback logging:", fallbackLogError);
            } else {
              logger.info("Fallback password access logged successfully", { success: true });
            }
          }
          
          // Personalized welcome message
          if (userName.trim()) {
            toast.success(`Welcome ${userName}!`);
          } else if (settingsData?.recipient_name) {
            toast.success(`Welcome ${settingsData.recipient_name}!`);
          } else {
            toast.success('Welcome to 247.art!');
          }
        }
        
        // Try to sign in with demo account automatically
        const signedIn = await signInWithDemoAccount();
        
        if (signedIn) {
          logger.info("Demo account sign-in successful after password entry", { success: true });
        } else {
          logger.warn("Demo account sign-in failed after password entry", { success: false });
        }
        
        setIsPasswordCorrect(true);
        localStorage.setItem("isPasswordCorrect", "true");
      } else {
        logger.error("Password validation failed for:", { password: normalizedPassword.substring(0, 2) + '***' });
        toast.error('Incorrect password. Please try again.', {
          duration: 3000
        });
      }
    } catch (error: any) {
      logger.error('Error checking password:', error);
      toast.error(`Error: ${error.message || 'Failed to validate password'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div>
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          required
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={`w-full ${nameError ? 'border-red-500' : ''}`}
          required
        />
        {nameError ? (
          <p className="text-xs text-red-500 mt-1">{nameError}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-zap-red text-white hover:bg-zap-red/80"
        disabled={isLoading}
      >
        {isLoading ? 'Checking...' : 'Enter'}
      </Button>
    </form>
  );
};


import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useClientIp = () => {
  const [clientIp, setClientIp] = useState<string>('client-detection-pending');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchIpAddress = async () => {
      // Log browser information to help debug
      const browserInfo = {
        userAgent: navigator.userAgent,
        browser: navigator.userAgent.match(/(edge|edg|chrome|safari|firefox|msie|trident)/i)?.[0]?.toLowerCase() || 'unknown'
      };
      
      logger.info("Browser information:", browserInfo);
      
      try {
        // Try all services with a timeout to avoid hanging
        const ipPromises = [
          fetchWithTimeout('https://api.ipify.org?format=json', 3000),
          fetchWithTimeout('https://ipinfo.io/json', 3000),
          fetchWithTimeout('https://api.ip.sb/jsonip', 3000),
          fetchWithTimeout('https://api64.ipify.org?format=json', 3000)
        ];
        
        // Race the promises - use the first one that resolves
        const response = await Promise.any(ipPromises);
        
        if (response) {
          const data = await response.json();
          const ip = data.ip;
          if (ip) {
            setClientIp(ip);
            logger.info("Successfully obtained IP address", { ip });
            setIsLoading(false);
            return;
          }
        }
        
        // If we get here, no service worked
        throw new Error("All IP services failed");
      } catch (error) {
        logger.warn("IP detection failed - proceeding without IP:", { error, browser: browserInfo.browser });
        // Set to a generic value but don't block the form
        setClientIp('ip-not-detected');
        setIsLoading(false);
      }
    };
    
    fetchIpAddress();
  }, []);
  
  return { clientIp, isLoading };
};

// Helper function to add timeout to fetch
const fetchWithTimeout = (url: string, timeout: number) => {
  return Promise.race([
    fetch(url),
    new Promise<Response>((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
    )
  ]) as Promise<Response>;
};

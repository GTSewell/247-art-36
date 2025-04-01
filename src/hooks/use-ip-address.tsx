
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useIpAddress = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getIpAddress = async () => {
      // Log browser information to help debug
      const browserInfo = {
        userAgent: navigator.userAgent,
        browser: navigator.userAgent.match(/(edge|edg|chrome|safari|firefox|msie|trident)/i)?.[0]?.toLowerCase() || 'unknown'
      };
      
      logger.info("Browser information:", browserInfo);
      
      try {
        // Instead of Promise.any, use Promise.allSettled and take the first resolved promise
        const ipPromises = [
          fetchWithTimeout('https://api.ipify.org?format=json', 3000),
          fetchWithTimeout('https://ipinfo.io/json', 3000),
          fetchWithTimeout('https://api.ip.sb/jsonip', 3000),
          fetchWithTimeout('https://api64.ipify.org?format=json', 3000)
        ];
        
        const results = await Promise.allSettled(ipPromises);
        
        // Find the first fulfilled promise
        const fulfilledResult = results.find(
          (result): result is PromiseFulfilledResult<Response> => 
            result.status === 'fulfilled'
        );
        
        if (fulfilledResult) {
          const response = fulfilledResult.value;
          const data = await response.json();
          const ip = data.ip;
          
          if (ip) {
            setIpAddress(ip);
            logger.info("Successfully obtained IP address", { ip });
            setIsLoading(false);
            return;
          }
        }
        
        // If we get here, no service worked
        throw new Error("All IP services failed");
      } catch (error) {
        logger.warn("IP detection failed - proceeding without IP:", { error, browser: browserInfo.browser });
        setIpAddress(null);
        setIsLoading(false);
      }
    };
    
    getIpAddress();
  }, []);
  
  return { ipAddress, isLoading };
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

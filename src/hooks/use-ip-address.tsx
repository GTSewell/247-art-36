
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
        // Try multiple IP services with extended timeout and fallback mechanisms
        const ipPromises = [
          fetchWithTimeout('https://api.ipify.org?format=json', 5000),
          fetchWithTimeout('https://ipinfo.io/json', 5000),
          fetchWithTimeout('https://api.ip.sb/jsonip', 5000),
          fetchWithTimeout('https://api64.ipify.org?format=json', 5000),
          fetchWithTimeout('https://ifconfig.me/all.json', 5000)
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
        
        // If all services failed, provide a fallback value
        logger.warn("All IP services failed - using fallback IP");
        setIpAddress("unknown-ip");
        setIsLoading(false);
      } catch (error) {
        logger.warn("IP detection failed - proceeding without IP:", { error, browser: browserInfo.browser });
        setIpAddress("detection-failed");
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
    fetch(url, { 
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'application/json'
      }
    }),
    new Promise<Response>((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
    )
  ]) as Promise<Response>;
};

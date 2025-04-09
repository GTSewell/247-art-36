
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useIpAddress = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if we've already gone through authentication
    const isAlreadyAuthenticated = localStorage.getItem("isPasswordCorrect") === "true";
    
    // If already authenticated, don't make unnecessary IP requests
    if (isAlreadyAuthenticated) {
      setIpAddress('auth-completed');
      setIsLoading(false);
      return;
    }
    
    const getIpAddress = async () => {
      // Log browser information to help debug
      const browserInfo = {
        userAgent: navigator.userAgent,
        browser: navigator.userAgent.match(/(edge|edg|chrome|safari|firefox|msie|trident)/i)?.[0]?.toLowerCase() || 'unknown'
      };
      
      logger.info("Browser information:", browserInfo);
      
      try {
        // Only try the most reliable service
        const response = await fetchWithTimeout('https://api.ipify.org?format=json', 8000);
        const data = await response.json();
        const ip = data.ip;
        
        if (ip) {
          setIpAddress(ip);
          logger.info("Successfully obtained IP address", { ip });
        } else {
          logger.warn("IP data missing from response");
          setIpAddress("ip-data-missing");
        }
      } catch (error) {
        logger.warn("IP detection failed - proceeding without IP:", { error, browser: browserInfo.browser });
        setIpAddress("detection-failed");
      } finally {
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

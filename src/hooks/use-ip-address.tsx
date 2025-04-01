
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useIpAddress = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          setIpAddress(data.ip);
          logger.info("Successfully obtained IP address from primary service", { ip: data.ip });
          setIsLoading(false);
          return;
        }
        
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
              setIsLoading(false);
              return;
            }
          } catch (innerError) {
            logger.warn(`Fallback IP service ${service} failed:`, { error: innerError });
          }
        }
        
        logger.error("All IP address services failed", { success: false });
        setIsLoading(false);
      } catch (error) {
        logger.error("Error fetching IP address:", { error });
        setIsLoading(false);
      }
    };
    
    getIpAddress();
  }, []);
  
  return { ipAddress, isLoading };
};

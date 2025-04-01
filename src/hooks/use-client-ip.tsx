
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useClientIp = () => {
  const [clientIp, setClientIp] = useState<string>('client-detection-pending');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          setClientIp(data.ip);
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
              setClientIp(ip);
              logger.info(`Successfully obtained IP address from fallback service ${service}`, { ip });
              setIsLoading(false);
              return;
            }
          } catch (innerError) {
            logger.warn(`Fallback IP service ${service} failed:`, { error: innerError });
          }
        }
        
        logger.error("All IP address services failed", { success: false });
        setClientIp('client-detection-failed');
        setIsLoading(false);
      } catch (error) {
        logger.error("Error fetching IP address:", { error });
        setClientIp('client-detection-error');
        setIsLoading(false);
      }
    };
    
    fetchIpAddress();
  }, []);
  
  return { clientIp, isLoading };
};

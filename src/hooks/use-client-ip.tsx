
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useClientIp = () => {
  const [clientIp, setClientIp] = useState<string>('client-detection-pending');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if we've already gone through authentication
    const isAlreadyAuthenticated = localStorage.getItem("isPasswordCorrect") === "true";
    
    // If already authenticated, don't make unnecessary IP requests
    if (isAlreadyAuthenticated) {
      setClientIp('auth-completed');
      setIsLoading(false);
      return;
    }
    
    const fetchIpAddress = async () => {
      try {
        // Use only one trusted service with increased timeout
        const response = await fetch('https://api.ipify.org?format=json', { 
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json'
          },
          // Longer timeout to prevent racing issues
          signal: AbortSignal.timeout(8000)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.ip) {
            setClientIp(data.ip);
            logger.info("Successfully obtained IP address", { ip: data.ip });
          } else {
            setClientIp('ip-data-missing');
            logger.warn("IP data missing from response");
          }
        } else {
          setClientIp('ip-service-error');
          logger.warn("IP service returned error", { status: response.status });
        }
      } catch (error) {
        logger.warn("IP detection failed - proceeding without IP:", error);
        setClientIp('detection-failed');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIpAddress();
  }, []);
  
  return { clientIp, isLoading };
};


/**
 * Utility to detect different runtime environments for the application
 */

// Detect if we're running in Lovable preview environment
export const isLovablePreview = (): boolean => {
  // Check for Lovable-specific properties in window or document
  return (
    (typeof window !== 'undefined' && 
     window.location.host.includes('lovable.dev')) ||
    document.referrer.includes('lovable.dev') ||
    // Look for lovable's script tag
    !!document.querySelector('script[src*="gpteng.co"]')
  );
};

// Get environment info for debugging
export const getEnvironmentInfo = (): Record<string, any> => {
  return {
    isLovablePreview: isLovablePreview(),
    isPWA: window.matchMedia('(display-mode: standalone)').matches,
    host: window.location.host,
    referrer: document.referrer,
    scripts: Array.from(document.querySelectorAll('script')).map(s => s.src),
    userAgent: navigator.userAgent,
    readyState: document.readyState,
    rootElement: !!document.getElementById('root')
  };
};

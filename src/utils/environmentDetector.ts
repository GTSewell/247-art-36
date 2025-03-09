
/**
 * Utility to detect different runtime environments for the application
 */

// Detect if we're running in Lovable preview environment
export const isLovablePreview = (): boolean => {
  try {
    // Check for Lovable-specific properties in window or document
    return (
      (typeof window !== 'undefined' && (
        window.location.host.includes('lovable.dev') ||
        window.location.host.includes('lovableproject.com') ||
        window.location.href.includes('preview--')
      )) ||
      (typeof document !== 'undefined' && (
        document.referrer.includes('lovable.dev') ||
        document.referrer.includes('lovableproject.com')
      )) ||
      // Look for lovable's script tag
      !!(typeof document !== 'undefined' && 
         document.querySelector('script[src*="gpteng.co"]')) ||
      // Additional checks for Lovable preview environment
      !!(typeof window !== 'undefined' && 
         (window as any).__LOVABLE_PREVIEW__ === true)
    );
  } catch (error) {
    // If any error occurs during detection, default to false
    console.error('Error in isLovablePreview detection:', error);
    return false;
  }
};

// Detect if we're in PWA standalone mode
export const isPWAMode = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           window.matchMedia && 
           window.matchMedia('(display-mode: standalone)').matches;
  } catch (error) {
    console.error('Error in isPWA detection:', error);
    return false;
  }
};

// Get environment info for debugging
export const getEnvironmentInfo = (): Record<string, any> => {
  try {
    return {
      isLovablePreview: isLovablePreview(),
      isPWA: isPWAMode(),
      host: typeof window !== 'undefined' ? window.location.host : 'unknown',
      href: typeof window !== 'undefined' ? window.location.href : 'unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : 'unknown',
      scripts: typeof document !== 'undefined' ? 
        Array.from(document.querySelectorAll('script')).map(s => s.src) : [],
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      readyState: typeof document !== 'undefined' ? document.readyState : 'unknown',
      rootElement: typeof document !== 'undefined' ? 
        !!document.getElementById('root') : false,
      displayMode: typeof window !== 'undefined' && window.matchMedia ? 
        window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser' : 'unknown'
    };
  } catch (error) {
    console.error('Error getting environment info:', error);
    return { error: String(error) };
  }
};

// Make this info available globally for debugging in preview
if (isLovablePreview() && typeof window !== 'undefined') {
  (window as any).__LOVABLE_PREVIEW__ = true;
  (window as any).__ENV_INFO__ = getEnvironmentInfo();
}

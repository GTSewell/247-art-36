
import { isLovablePreview, isPWAMode } from './utils/environmentDetector';
import { logger } from './utils/logger';

export const registerServiceWorker = () => {
  // Ensure we never register a service worker in preview mode
  if (isLovablePreview()) {
    logger.info('Skipping service worker registration in preview mode');
    return;
  }

  // Only proceed if service workers are supported
  if ('serviceWorker' in navigator) {
    // Wait for load to avoid competing for resources
    window.addEventListener('load', () => {
      try {
        // First, clear any existing registrations to ensure we start fresh
        navigator.serviceWorker.getRegistrations()
          .then(registrations => {
            if (registrations.length > 0) {
              logger.info('Unregistering existing service workers first...');
              // Unregister all existing service workers
              return Promise.all(
                registrations.map(registration => registration.unregister())
              );
            }
            return Promise.resolve([]);
          })
          .then(() => {
            logger.info('Registering service worker...');
            return navigator.serviceWorker.register('/service-worker.js', {
              scope: '/'
            });
          })
          .then(registration => {
            logger.info('ServiceWorker registration successful with scope: ', registration.scope);
            
            // If we're in standalone mode, set the session flag
            if (isPWAMode() && sessionStorage) {
              sessionStorage.setItem('running_as_pwa', 'true');
              logger.info('PWA mode confirmed and session flag set');
            }
            
            // Check if there's an update and notify the user
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    logger.info('New content is available; please refresh.');
                    // Show toast notification if in PWA mode
                    if (isPWAMode()) {
                      if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('247.ART Update Available', {
                          body: 'A new version is available. Refresh to update.',
                          icon: '/lovable-uploads/0a46328d-bced-45e2-8877-d5c6914ff44c.png'
                        });
                      }
                    }
                  }
                });
              }
            });
          })
          .catch(error => {
            logger.error('ServiceWorker registration failed: ', error);
          });
      } catch (error) {
        logger.error('Error during service worker registration process:', error);
      }
    });
  } else {
    logger.info('Service workers are not supported in this browser');
  }
};

// Add event listener for PWA lifecycle events
window.addEventListener('load', () => {
  // Skip all PWA-related logic in Lovable preview mode
  if (isLovablePreview()) {
    logger.info('Skipping PWA lifecycle events in preview mode');
    return;
  }
  
  try {
    // Add this to diagnose PWA startup issues
    const currentMode = isPWAMode() ? 'standalone/PWA' : 'browser';
    logger.info('Application loaded in mode:', currentMode);
    
    // Handle PWA display modes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      
      const handleDisplayModeChange = (evt: MediaQueryListEvent | MediaQueryList) => {
        const isStandalone = evt.matches;
        const newMode = isStandalone ? 'standalone/PWA' : 'browser';
        logger.info(`Display mode ${evt === mediaQuery ? 'initially' : 'changed to'}: ${newMode}`);
        
        // Set flag for PWA mode
        if (isStandalone && sessionStorage) {
          sessionStorage.setItem('running_as_pwa', 'true');
        }
        
        // If display mode changed (not initial check), reload to apply correct routing
        if (evt !== mediaQuery) {
          window.location.reload();
        }
      };
      
      // Initial check
      handleDisplayModeChange(mediaQuery);
      
      // Set up listener for changes - with browser compatibility
      try {
        mediaQuery.addEventListener('change', handleDisplayModeChange);
      } catch (err) {
        // Fallback for older browsers
        // @ts-ignore - for older browsers
        mediaQuery.addListener && mediaQuery.addListener(handleDisplayModeChange);
      }
    }
    
    // Add event listener to check if document loaded correctly
    logger.info('Document readiness state:', document.readyState);
    if (document.readyState === 'complete') {
      logger.info('DOM fully loaded and parsed');
      logger.info('Root element exists:', !!document.getElementById('root'));
    }
    
    // Request notification permission for PWA
    if (isPWAMode() && !isLovablePreview()) {
      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  } catch (error) {
    logger.error('Error in PWA lifecycle event handling:', error);
  }
});

// Add helpers for PWA installation prompts
export const listenForInstallPrompt = (callback: (event: BeforeInstallPromptEvent) => void) => {
  if (isLovablePreview()) return; // Skip in preview mode
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    callback(e as BeforeInstallPromptEvent);
  });
};

// Define BeforeInstallPromptEvent for TypeScript
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

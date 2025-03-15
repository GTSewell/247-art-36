
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // First, clear any existing registrations to ensure we start fresh
      navigator.serviceWorker.getRegistrations()
        .then(registrations => {
          if (registrations.length > 0) {
            console.log('Unregistering existing service workers first...');
            // Unregister all existing service workers
            return Promise.all(
              registrations.map(registration => registration.unregister())
            );
          }
          return Promise.resolve([]);
        })
        .then(() => {
          console.log('Registering service worker...');
          return navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });
        })
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check if there's an update and notify the user
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                  // Show toast notification if in PWA mode
                  if (window.matchMedia('(display-mode: standalone)').matches) {
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
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  } else {
    console.log('Service workers are not supported in this browser');
  }
};

// Add function to manually clear the cache and reload
export const clearCacheAndReload = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      if (registrations.length > 0) {
        console.log('Clearing cache via service worker...');
        // Try to send message to service worker to clear cache
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage('clearCache');
        }
        
        // Also attempt to clear browser caches
        if ('caches' in window) {
          console.log('Clearing browser caches...');
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        // Unregister all workers
        await Promise.all(registrations.map(reg => reg.unregister()));
        console.log('Service workers unregistered');
        
        // Give a moment for cache clearing to complete
        setTimeout(() => {
          console.log('Reloading page...');
          window.location.reload(true);
        }, 1000);
      } else {
        // No service worker, just reload
        window.location.reload(true);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Fallback to simple reload
      window.location.reload(true);
    }
  } else {
    // No service worker support, just reload
    window.location.reload(true);
  }
};

// Add event listener for PWA lifecycle events
window.addEventListener('load', () => {
  // Add this to diagnose PWA startup issues
  console.log('Application loaded in mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone/PWA' : 'browser');
  
  // Handle PWA display modes
  window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    console.log('Display mode changed to:', evt.matches ? 'standalone/PWA' : 'browser');
    // Reload the page to apply correct routing
    window.location.reload();
  });
  
  // Add event listener to check if document loaded correctly
  console.log('Document readiness state:', document.readyState);
  if (document.readyState === 'complete') {
    console.log('DOM fully loaded and parsed');
    console.log('Root element exists:', !!document.getElementById('root'));
  }
  
  // Request notification permission for PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
});

// Add helpers for PWA installation prompts
export const listenForInstallPrompt = (callback: (event: BeforeInstallPromptEvent) => void) => {
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

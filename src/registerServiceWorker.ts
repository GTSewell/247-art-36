
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // First, clear any existing registrations to ensure we start fresh
      navigator.serviceWorker.getRegistrations()
        .then(registrations => {
          if (registrations.length > 0) {
            console.log('Unregistering existing service workers first...');
            return Promise.all(registrations.map(registration => registration.unregister()));
          }
          return Promise.resolve();
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

// Add event listener for PWA lifecycle events
window.addEventListener('load', () => {
  // Add this to diagnose PWA startup issues
  console.log('Application loaded in mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone/PWA' : 'browser');
  
  // Handle PWA display modes
  window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    console.log('Display mode changed to:', evt.matches ? 'standalone/PWA' : 'browser');
  });
  
  // Add event listener to check if document loaded correctly
  console.log('Document readiness state:', document.readyState);
  if (document.readyState === 'complete') {
    console.log('DOM fully loaded and parsed');
    console.log('Root element exists:', !!document.getElementById('root'));
  }
});

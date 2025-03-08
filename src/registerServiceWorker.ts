
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
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
});
